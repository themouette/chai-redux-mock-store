Redux Mock Store chai helpers
=============================

[![Build
Status](https://travis-ci.org/themouette/chai-redux-mock-store.svg?branch=master)](https://travis-ci.org/themouette/chai-redux-mock-store)

A set of helpers to use with [chaijs](http://chaijs.com) and
[redux-mock-store](http://arnaudbenard.com/redux-mock-store/).

## Install

```
npm install --save redux
npm install --save-dev chai-redux-mock-store redux-mock-store
```

## Setup:

In a `tests/helpers.js` file put the following content:

``` javascript
import chai from 'chai';
import chaiReduxMockStore from 'chai-redux-mock-store';


chai.use(chaiReduxMockStore);
```

Run your tests with this file loaded.

For instance if you use [mocha](https://mochajs.org/):

```
mocha --require tests/helpers.js src/**/*-test.js
```

## Examples

### `dispatchedActions`

``` javascript
it('should work', () => {
  const store = createMockStore();

  store.dispatch({ type: 'MyAction' });
  store.dispatch({ type: 'MyOtherAction', payload: 'Foo' });

  expect(store).to.have.dispatchedActions([
    { type: 'MyAction' },
    { type: 'MyOtherAction', payload: 'Foo' },
  ]);
});

it('should work with contain', () => {
  const store = createMockStore();

  store.dispatch({ type: 'MyAction' });
  store.dispatch({ type: 'MyOtherAction', payload: 'Foo' });

  expect(store).to.contain.dispatchedActions([
    { type: 'MyOtherAction', payload: 'Foo' },
  ]);
});

it('should work with function matcher', () => {
  const store = createMockStore();

  store.dispatch({ type: 'MyAction' });
  store.dispatch({ type: 'MyOtherAction', payload: 'Foo' });

  expect(store).to.have.dispatchedActions([
    { type: 'MyAction' },
    (action) => expect(action).to.have.property('payload', 'Foo'),
  ]);
});
```

### `dispatchedTypes`

``` javascript
it('should work', () => {
  const store = createMockStore();

  store.dispatch({ type: 'MyAction' });
  store.dispatch({ type: 'MyOtherAction', payload: 'Foo' });

  expect(store).to.have.dispatchedTypes(['MyAction', 'MyOtherAction']);
});

it('should work with contain', () => {
  const store = createMockStore();

  store.dispatch({ type: 'MyAction' });
  store.dispatch({ type: 'MyOtherAction', payload: 'Foo' });

  expect(store).to.contain.dispatchedTypes(['MyOtherAction']);
});
```
