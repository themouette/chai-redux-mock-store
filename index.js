'use strict'
// Usage:
//
// expect(store).to.have.dispatchedActions({ type: 'Blah' });
// expect(store).to.have.dispatchedActions([{ type: 'Blah' }, { type: 'Bloh' }]);
// expect(store).to.contain.dispatchedActions({ type: 'Blah' });
// expect(store).to.contain.dispatchedActions([{ type: 'Blah' }, { type: 'Bloh' }]);
//
// expect(store).to.have.dispatchedTypes('Blah');
// expect(store).to.have.dispatchedTypes(['Blah', 'Bloh']);
// expect(store).to.contains.dispatchedTypes('Blah');
// expect(store).to.contains.dispatchedTypes(['Blah', 'Bloh']);
module.exports = function chaiReduxMockStore(chai, utils) {
  var Assertion = chai.Assertion;

  function assertIsReduxStore(obj) {
    new Assertion(obj).to.respondTo('getActions');

    return obj;
  }

  // Exact match for an action
  // This performs a deep equal
  function createDeepEqualMatcher(expectedAction) {
    return function match(action) {
      new Assertion(action).to.deep.equal(expectedAction);
    };
  }

  function assertActionMatch(action, paramMatcher) {
    let matcher = paramMatcher;
    if (typeof matcher !== 'function') {
      matcher = createDeepEqualMatcher(paramMatcher);
    }

    matcher(action);
  }

  function assertDispatchedActionsContains(expectedActions, actions) {
    var actionsIterator;
    var expectedIterator = 0;
    var expected = [].concat(expectedActions);
    var actual = [].concat(actions);

    for (
      actionsIterator = 0;
      actionsIterator < actions.length && expectedIterator < expectedActions.length;
      actionsIterator += 1
    ) {
      try {
        expected = expectedActions[expectedIterator];
        assertActionMatch(actions[actionsIterator], expectedActions[expectedIterator]);
        expectedIterator += 1;
        actual.shift();
      } catch (err) {
        // Let's try again with next dispatched action
      }
    }

    this.assert(
      expectedIterator >= expectedActions.length,
      `Unable to find expected action at position ${expectedIterator} #{exp}`,
      'All actions have been found',
      typeof expected === 'function' ? null : expected,
      actual,
      true // do not show diff for functions
    );
  }

  function assertExactDispatchedActions(expectedActions, actions) {
    var error;
    var errorPosition = -1;
    var expected = [].concat(expectedActions);
    var actual = actions;
    var i;
    var len = Math.min(actions.length, expectedActions.length);

    for (i = 0; i < len && !error; i += 1) {
      try {
        actual = actions[i];
        assertActionMatch(actions[i], expectedActions[i]);
        expected.shift();
      } catch (err) {
        error = `at position ${i}:\n\t${err.toString()}`;
        errorPosition = i;
        // copy expected and actual if any.
        // default fallback to remaining actions
        expected = err.expected ? err.expected : expectedAction[i];
        actual = err.actual ? err.actual : actual;
      }
    }

    this.assert(
      !error,
      `unexpected error for action ${error}`,
      'should have an error but got all expected actions',
      expected,
      actual,
      errorPosition > -1 && typeof expectedActions[errorPosition] !== 'string'
    );

    new Assertion(actions.slice(len))
      .to.deep.equal([], 'More actions where dispatched than expected');
    new Assertion(expectedActions.length)
      .to.be.equal(len, `Expect ${expectedActions.length} actions, ${len} dispatched`);
  }

  function dispatchedActions(paramActions) {
    var store = assertIsReduxStore(this._obj);

    var expectedActions = [].concat(paramActions);
    var actions = store.getActions();

    if (utils.flag(this, 'contains')) {
      assertDispatchedActionsContains.call(this, expectedActions, actions);
    } else {
      assertExactDispatchedActions.call(this, expectedActions, actions);
    }
  }


  function assertDispatchedTypesContains(expectedTypes, types) {
    var typesIterator;
    var expectedIterator = 0;

    for (
      typesIterator = 0;
      typesIterator < types.length && expectedIterator < expectedTypes.length;
      typesIterator += 1
    ) {
      try {
        new Assertion(types[typesIterator]).to.equal(expectedTypes[expectedIterator]);
        expectedIterator += 1;
      } catch (err) {
        // Let's try again with next dispatched type
      }
    }

    this.assert(
      expectedIterator >= expectedTypes.length,
      `Unable to find expected type at position ${expectedIterator} #{exp}`,
      'All types have been found',
      expectedTypes[expectedIterator]
    );
  }

  function assertExactDispatchedTypes(expectedTypes, types) {
    var len = Math.min(types.length, expectedTypes.length);

    this.assert(
      utils.eql(types.slice(0, len), expectedTypes.slice(0, len)),
      'Types does not match',
      'Types should not match',
      expectedTypes,
      types,
      true
    );

    new Assertion(types.slice(len))
      .to.deep.equal([], 'More actions where dispatched than expected');
    new Assertion(expectedTypes.length)
      .to.be.equal(len, `Expect ${expectedTypes.length} types, ${len} dispatched`);
  }


  function dispatchedTypes(paramTypes) {
    var store = assertIsReduxStore(this._obj);

    var expectedTypes = [].concat(paramTypes);
    var types = store.getActions().map((action) => action.type);

    if (utils.flag(this, 'contains')) {
      assertDispatchedTypesContains.call(this, expectedTypes, types);
    } else {
      assertExactDispatchedTypes.call(this, expectedTypes, types);
    }
  }

  Assertion.addMethod('dispatchedAction', dispatchedActions);
  Assertion.addMethod('dispatchedActions', dispatchedActions);

  Assertion.addMethod('dispatchedType', dispatchedTypes);
  Assertion.addMethod('dispatchedTypes', dispatchedTypes);

  Assertion.addChainableMethod('actions', function dispatched(action) {
    var store = assertIsReduxStore(this._obj);

  });
};
