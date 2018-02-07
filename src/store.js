const { createStore, applyMiddleware } = require('redux');
const { createEpicMiddleware } = require('redux-observable');

const { rootReducer, rootEpic } = require('./modules');

const store = createStore(rootReducer, applyMiddleware(createEpicMiddleware(rootEpic)));

module.exports = store;
