

const frs = fs.createReadStream(fileName, 'utf8');
const fws = fs.createWriteStream(fileName + '.out');
const sourceSize = fs.statSync(fileName).size;
const jsonTransform = new JSONTransform();

frs.pipe(jsonTransform);

const progressBar = document.querySelector('.progress-bar');
const progressCounter = document.querySelector('.progress');
const recordsCounter = document.querySelector('.records-count');

let count = 0;

jsonTransform.on('data', data => {
  const progress = (fws.bytesWritten * 100) / sourceSize, recordsCount);
  count += data.length;
  progressBar.style.width = progress + '%';
  progressCounter.innerText = progress + '%';
  recordsCounter.innerText = `Total records parsed: ${count}`;
});