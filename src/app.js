import 'any-observable/register/rxjs';
import './rx-operators';

import store from './store';
import { transformAction } from './modules/transform';
import fileOpenDialog from './utils/file-open-dialog';

import TRANSFORM_STATUS from './constants/transofrm-status';

let inputFile = '';
const openFileBtn = document.querySelector('.open-file-btn');

openFileBtn.addEventListener('click', () => { 
  inputFile = fileOpenDialog('json');
  store.dispatch(transformAction(TRANSFORM_STATUS.STARTED, inputFile[0]));
});

const progressBar = document.querySelector('.progress-bar');
const progressCounter = document.querySelector('.progress');
const recordsCounter = document.querySelector('.records-count');

store.subscribe(() => {
  const { progress, count } = store.getState().transform;

  if (progress) {
    progressBar.style.width = progress + '%';
    progressCounter.innerText = progress + '%';
    recordsCounter.innerText = `Total records parsed: ${count}`;
  }
});
