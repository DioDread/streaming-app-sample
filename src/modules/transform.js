import fs from 'fs';
import { Observable } from 'rxjs';
import streamToObservable from 'stream-to-observable';

const TRANSFORM_ACTION = 'streaming-app-sample/transform/TRANSFORM_ACTION';
const TRANSFORM_PROGRESS = 'streaming-app-sample/transform/TRANSFORM_PROGRESS';
const TRANSFORM_COMPLETE = 'streaming-app-sample/transform/TRANSFORM_COMPLETE';
const TRANSFORM_FAILED = 'streaming-app-sample/transform/TRANSFORM_FAILED';

const INITIAL_STATE = {};

const transformAction = (status, fileName) => ({
  type: TRANSFORM_ACTION,
  status,
  fileName,
});

const transformProgress = progress => ({
  type: TRANSFORM_PROGRESS,
  progress,
});

const transformEpic = (action$, store) => 
  action$.ofType(TRANSFORM_ACTION)
    .flatMap(action => {
      const { fileName, status } = action;
      console.log(action);
      const frs = fs.createReadStream(fileName);
      const fws = fs.createWriteStream(fileName + '.out');
      const sourceSize = fs.statSync(fileName).size;
      frs.pipe(fws);
      return streamToObservable(frs)
        .filter(
          () => (fws.bytesWritten * 100) % sourceSize == 0
        )
        .map(
          data => transformProgress((fws.bytesWritten * 100) / sourceSize)
        );
    })

const transformReducer = (state = INITIAL_STATE, action) => {
  // console.log(action);
  switch(action.type) {
    case TRANSFORM_ACTION:
      return { 
        ...state,
        status: action.status, 
        fileName: action.fileName,
      };
    case TRANSFORM_PROGRESS:
      return {
        ...state,
        progress: Number(action.progress.toFixed(2)),
      }
    default:
      return state;
  }
}

module.exports = {
  transformReducer,
  transformAction,
  transformEpic,
}