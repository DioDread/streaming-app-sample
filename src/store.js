import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import { rootReducer, rootEpic } from './modules';

const store = createStore(rootReducer, applyMiddleware(createEpicMiddleware(rootEpic)));

export default store;
