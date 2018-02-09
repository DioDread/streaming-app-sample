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
  console.log(inputFile);
  store.dispatch(transformAction(TRANSFORM_STATUS.STARTED, inputFile[0]));
});

const progressBar = document.querySelector('.progress-bar');
const progressCounter = document.querySelector('.progress');

store.subscribe(() => {
  const { progress } = store.getState().transform;
  console.log(progress);

  if (progress) {
    progressBar.style.width = progress + '%';
    progressCounter.innerText = progress + '%';
  }
});

// setTimeout(() => progressBar.style.width = '35%', 2000);
// setTimeout(() => progressBar.style.width = '45%', 1000);
// setTimeout(() => progressBar.style.width = '75%', 2000);
// setTimeout(() => progressBar.style.width = '95%', 500);
// setTimeout(() => progressBar.style.width = '100%', 5000);