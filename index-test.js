'use strict';

const chai = require('chai');
const configureStore = require('redux-mock-store').default;


chai.use(require('./'));
const expect = chai.expect;

describe('redux-mock-store', () => {
  const createMockStore = (getState) => {
    const middlewares = [];
    return configureStore(middlewares)(getState);
  };

  describe('dispatched with single expectation', () => {
    it('should work for sync action', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyAction' });

      expect(store).to.have.dispatchedActions({ type: 'MyAction' });
    });

    it('should throw for sync action', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyAction' });

        expect(store).to.have.dispatchedActions({ type: 'MyNotAction' });
      }).to.throw();
    });

    it('should work for negate sync action', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyAction' });

      expect(store).to.not.have.dispatchedActions({ type: 'MyNotAction' });
    });

    it('should throw for negate sync action', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyAction' });

        expect(store).to.not.have.dispatchedActions({ type: 'MyAction' });
      }).to.throw();
    });
  });

  describe('dispatched with single expectation and function match', () => {
    it('should work for sync action', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyAction' });

      expect(store).to.have.dispatchedActions(
        (action) => expect(action).to.have.property('type', 'MyAction')
      );
    });

    it('should throw for sync action', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyAction' });

        expect(store).to.have.dispatchedActions(
          (action) => expect(action).to.have.property('type', 'MyNotAction')
        );
      }).to.throw();
    });

    it('should work for negate sync action', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyAction' });

      expect(store).to.not.have.dispatchedActions(
        (action) => expect(action).to.have.property('type', 'MyNotAction')
      );
    });

    it('should throw for negate sync action', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyAction' });

        expect(store).to.not.have.dispatchedActions(
          (action) => expect(action).to.have.property('type', 'MyAction')
        );
      }).to.throw();
    });

    it('should display diff', () => {
      try {
        const store = createMockStore();

        store.dispatch({
          type: 'MyAction',
          payload: {
            foo: 'foo',
            bar: 'bar',
          }
        });

        expect(store).to.have.dispatchedActions(
          (action) => expect(action).to.deep.equal({
            type: 'MyAction',
            payload: {
              foo: 'bar',
              bar: 'bar',
            }
          })
        );

        throw new Error('should have thrown.');
      } catch (err) {
        expect(err.actual).to.deep.equal({
          type: 'MyAction',
          payload: {
            foo: 'foo',
            bar: 'bar',
          }
        });
        expect(err.expected).to.deep.equal({
          type: 'MyAction',
          payload: {
            foo: 'bar',
            bar: 'bar',
          }
        });
        expect(err.showDiff).to.be.true;
      }
    });
  });

  describe('with several actions', () => {
    it('should be fine if all matches', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyFirstAction' });
      store.dispatch({ type: 'MySecondAction' });

      expect(store).to.have.dispatchedActions([
        { type: 'MyFirstAction' },
        { type: 'MySecondAction' },
      ]);
    });

    it('should be fine if negate and one mismatches', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyFirstAction' });
      store.dispatch({ type: 'MySecondAction' });

      expect(store).to.not.have.dispatchedActions([
        { type: 'MyOtherAction' },
        { type: 'MySecondAction' },
      ]);
    });

    it('should be fine if negate and other mismatches', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyFirstAction' });
      store.dispatch({ type: 'MySecondAction' });

      expect(store).to.not.have.dispatchedActions([
        { type: 'MyFirstAction' },
        { type: 'MyThirdAction' },
      ]);
    });

    it('should throw if negated and all matches', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });

        expect(store).to.not.have.dispatchedActions([
          { type: 'MyFirstAction' },
          { type: 'MySecondAction' },
        ]);
      }).to.throw();
    });

    it('should throw if one mismatches', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });

        expect(store).to.have.dispatchedActions([
          { type: 'MyOtherAction' },
          { type: 'MySecondAction' },
        ]);
      }).to.throw();
    });

    it('should throw if other mismatches', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });

        expect(store).to.have.dispatchedActions([
          { type: 'MyFirstAction' },
          { type: 'MyOtherAction' },
        ]);
      }).to.throw();
    });

    it('should display diff', () => {
      try {
        const store = createMockStore();

        store.dispatch({ type: 'MyAction', payload: { foo: 'foo', bar: 'bar' } });
        store.dispatch({ type: 'MyOtherAction', payload: { foo: 'foo' } });

        expect(store).to.have.dispatchedActions([
          (action) => expect(action).to.deep.equal({
            type: 'MyAction', payload: { foo: 'foo', bar: 'bar' }
          }),
          (action) => expect(action).to.deep.equal({
            type: 'MyOtherAction', payload: { foo: 'bar', bar: 'bar' }
          })
        ]);

        throw new Error('should have thrown.');
      } catch (err) {
        expect(err.actual).to.deep.equal({
          type: 'MyOtherAction', payload: { foo: 'foo' }
        });
        expect(err.expected).to.deep.equal({
          type: 'MyOtherAction', payload: { foo: 'bar', bar: 'bar' }
        });
        expect(err.showDiff).to.be.true;
      }
    });
  });

  describe('contains', () => {
    it('should be fine if action is contained', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyFirstAction' });
      store.dispatch({ type: 'MySecondAction' });

      expect(store).to.contain.dispatchedActions([
        { type: 'MyFirstAction' },
      ]);
    });

    it('should be fine if action is contained (not first)', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyFirstAction' });
      store.dispatch({ type: 'MySecondAction' });

      expect(store).to.contain.dispatchedActions([
        { type: 'MyFirstAction' },
      ]);
    });

    it('should trow if action is not contained', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });

        expect(store).to.contain.dispatchedActions([
          { type: 'MyOtherAction' },
        ]);
      }).to.throw();
    });

    it('should trow if action is not contained (multiple)', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });

        expect(store).to.contain.dispatchedActions([
          { type: 'MyFirstAction' },
          { type: 'MySecondAction' },
          { type: 'MyOtherAction' },
        ]);
      }).to.throw();
    });

    it('should display diff', () => {
      try {
        const store = createMockStore();

        store.dispatch({ type: 'MyAction', payload: { foo: 'foo', bar: 'bar' } });
        store.dispatch({ type: 'MyOtherAction', payload: { foo: 'foo' } });

        expect(store).to.contain.dispatchedActions([
          (action) => expect(action).to.deep.equal({
            type: 'MyAction', payload: { foo: 'foo', bar: 'bar' }
          }),
          { type: 'MyOtherAction', payload: { foo: 'bar', bar: 'bar' } },
        ]);

        throw new Error('should have thrown.');
      } catch (err) {
        expect(err.actual).to.deep.equal([
          { type: 'MyOtherAction', payload: { foo: 'foo' } },
        ]);
        expect(err.expected).to.deep.equal({
          type: 'MyOtherAction', payload: { foo: 'bar', bar: 'bar' }
        });
        expect(err.showDiff).to.be.true;
      }
    });

    it('should not display diff for function', () => {
      try {
        const store = createMockStore();

        store.dispatch({ type: 'MyAction', payload: { foo: 'foo', bar: 'bar' } });
        store.dispatch({ type: 'MyOtherAction', payload: { foo: 'foo' } });

        expect(store).to.contain.dispatchedActions([
          (action) => expect(action).to.deep.equal({
            type: 'MyAction', payload: { foo: 'foo', bar: 'bar' }
          }),
          (action) => expect(action).to.deep.equal({
            type: 'MyOtherAction', payload: { foo: 'bar', bar: 'bar' },
          }),
        ]);

        throw new Error('should have thrown.');
      } catch (err) {
        expect(err.actual).to.deep.equal([
          { type: 'MyOtherAction', payload: { foo: 'foo' } },
        ]);
        expect(err.expected).to.be.null;
        expect(err.showDiff).to.be.true;
      }
    });
  });

  describe('dispatchedTypes', () => {
    it('should be fine if types matches', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyFirstAction' });
      store.dispatch({ type: 'MySecondAction' });

      expect(store).to.have.dispatchedTypes(['MyFirstAction', 'MySecondAction']);
    });

    it('should throw if negates and types matches', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });

        expect(store).to.not.have.dispatchedTypes(['MyFirstAction', 'MySecondAction']);
      }).to.throw();
    });

    it('should throw if types mismatches', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });

        expect(store).to.have.dispatchedTypes(['MyFirstAction', 'MyOtherAction']);
      }).to.throw();
    });

    it('should throw if there is extra dispatched type', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });
        store.dispatch({ type: 'MyThirdAction' });

        expect(store).to.have.dispatchedTypes(['MyFirstAction', 'MySecondAction']);
      }).to.throw();
    });

    it('should throw if there is extra dispatched type and negated', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });
        store.dispatch({ type: 'MyThirdAction' });

        expect(store).to.not.have.dispatchedTypes(['MyFirstAction', 'MySecondAction']);
      }).to.throw();
    });

    it('should throw if there is extra expected type', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });

        expect(store).to.have.dispatchedTypes([
          'MyFirstAction', 'MySecondAction', 'MyThirdAction']);
      }).to.throw();
    });

    it('should throw if there is extra expected type and negated', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });

        expect(store).to.not.have.dispatchedTypes([
          'MyFirstAction', 'MySecondAction', 'MyThirdAction']);
      }).to.throw();
    });
  });

  describe('contains types', () => {
    it('shoudl be fine if types are contained', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyFirstAction' });
      store.dispatch({ type: 'MySecondAction' });

      expect(store).to.contain.dispatchedTypes(['MySecondAction']);
    });

    it('shoudl be fine if all types are contained', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyFirstAction' });
      store.dispatch({ type: 'MySecondAction' });

      expect(store).to.contain.dispatchedTypes(['MyFirstAction', 'MySecondAction']);
    });

    it('should throw if there is extra expected type', () => {
      expect(() => {
        const store = createMockStore();

        store.dispatch({ type: 'MyFirstAction' });
        store.dispatch({ type: 'MySecondAction' });

        expect(store).to.contain.dispatchedTypes([
          'MyFirstAction', 'MySecondAction', 'MyThirdAction']);
      }).to.throw();
    });

    it('should be fine if there is extra expected type and negated', () => {
      const store = createMockStore();

      store.dispatch({ type: 'MyFirstAction' });
      store.dispatch({ type: 'MySecondAction' });

      expect(store).to.not.contain.dispatchedTypes([
        'MyFirstAction', 'MySecondAction', 'MyThirdAction']);
    });
  });
});
