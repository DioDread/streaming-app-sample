import { combineReducers } from 'redux';
import  { combineEpics }from 'redux-observable';

import transformReducer, { transformEpic } from './transform';

const rootReducer = combineReducers({ transform: transformReducer });
const rootEpic = combineEpics(transformEpic);

export {
  rootEpic,
  rootReducer,
};
