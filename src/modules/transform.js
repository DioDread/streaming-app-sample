import fs from 'fs';
import { Observable } from 'rxjs';
import streamToObservable from 'stream-to-observable';

import JSONTransform from '../stream/json-transform';

import PROCESS_STATUS from '../constants/process-status';

const TRANSFORM_ACTION = 'streaming-app-sample/transform/TRANSFORM_ACTION';
const TRANSFORM_PROGRESS = 'streaming-app-sample/transform/TRANSFORM_PROGRESS';
const TRANSFORM_CANCELED = 'streaming-app-sample/transform/TRANSFORM_CANCELED';
const TRANSFORM_COMPLETE = 'streaming-app-sample/transform/TRANSFORM_COMPLETE';
const TRANSFORM_FAILED = 'streaming-app-sample/transform/TRANSFORM_FAILED';

const INITIAL_STATE = {};

let transformStatus = PROCESS_STATUS.UNSPECIFIED;

const transformAction = (status, fileName) => ({
  type: TRANSFORM_ACTION,
  status,
  fileName,
});

const transformProgress = (progress, count) => ({
  type: TRANSFORM_PROGRESS,
  progress,
  count,
});

const transformFailed = reason => ({
  type: TRANSFORM_FAILED,
  reason,
});

const transformFinished = () => ({
  type: transformStatus !== PROCESS_STATUS.CANCELED ? TRANSFORM_COMPLETE : TRANSFORM_CANCELED,
})

const transformEpic = (action$, store) => 
  action$.ofType(TRANSFORM_ACTION)
    .flatMap(action => {
      transformStatus = action.status;
      if (transformStatus === PROCESS_STATUS.CANCELED) {
        return Observable.empty();
      }      
      const { fileName } = action;
      const frs = fs.createReadStream(fileName, 'utf8');
      const fws = fs.createWriteStream(fileName + '.out');
      const sourceSize = fs.statSync(fileName).size;
      const jsonTransform = new JSONTransform();
      let recordsCount = 0;
      frs.pipe(jsonTransform);
      frs.pipe(fws);
      return streamToObservable(jsonTransform)
        .takeWhile(() => transformStatus !== PROCESS_STATUS.CANCELED)
        .map(
          data => {
            recordsCount += data.length;
            return transformProgress((fws.bytesWritten * 100) / sourceSize, recordsCount);
          }
        )
        .catch(transformFailed)
        .concat(Observable.of('')
          .map(() => transofrmFinished()
        ))
        .finally(() => {
          frs.close();
          jsonTransform.end();
          fws.end();
        });
    });

const reducer = (state = INITIAL_STATE, action) => {
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
        count: action.count,
      }
    case TRANSFORM_COMPLETE:
      return {
        ...state,
        progress: 100,
      }
    default:
      return state;
  }
}

export default reducer;

export {
  transformAction,
  transformEpic,  
};
