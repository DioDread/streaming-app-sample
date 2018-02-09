const { combineReducers } = require('redux');
const { combineEpics } = require('redux-observable');

const { transformReducer, transformEpic } = require('./transform');

const rootReducer = combineReducers({ transform: transformReducer });
const rootEpic = combineEpics(transformEpic);

module.exports = {
  rootEpic,
  rootReducer,
};
