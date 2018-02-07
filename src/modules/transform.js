const { Observable } = require('rxjs');

const TRANSFORM_ACTION = 'streaming-app-sample/transform/TRANSFORM_ACTION';

const INITIAL_STATE = {};

const transformAction = () => ({
  type: TRANSFORM_ACTION,
});

const transformEpic = (action$, store) => 
  action$.ofType(TRANSFORM_ACTION)
    .flatMap(action => {
      console.log(action);
      return Observable.empty();
    })

const transformReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case TRANSFORM_ACTION:
      return Object.assign({ payload: action.payload }, state);
    default:
      return state;
  }
}

module.exports = {
  transformReducer,
  transformAction,
  transformEpic,
}