import { Transform } from 'stream';

const kSource = global.Symbol('source');

export default class JSONTransform extends Transform {
  constructor() {
    super({ writableObjectMode: true, readableObjectMode: true });
    this[kSource] = [];
    this.splitChunk = '';
  }

  isValidJSON(line) {
    let o;
    try {
      o = JSON.parse(line);
    } catch(e) {
      return false;
    }
    return typeof o === 'object';
  }

  _transform(chunk, encoding, callback) {
    if (this.splitChunk) {
      chunk = this.splitChunk + chunk;
      this.splitChunk = '';
    }
    this[kSource] = this[kSource].concat(
      chunk
        .split('\n')
        .filter(Boolean)
    );
    if (this[kSource].length === 0) {
      return callback();
    }
    const lastLine = this[kSource][this[kSource].length - 1];
    if (this.isValidJSON(lastLine)) {
      return callback(null, this[kSource].map(JSON.parse));
      this[kSource] = [];
    } else {
      const linesToWrite = this[kSource].slice(0, this[kSource].length - 2);
      this.splitChunk = [this[kSource][this[kSource].length - 1]];
      this[kSource] = [];
      return callback(null, linesToWrite.map(JSON.parse))
    }
  }
}