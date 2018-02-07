require('./rx-operators');

const store = require('./store');
const { transformAction } = require('./modules/transform');

function init() {
  store.dispatch(transformAction());
}

module.exports = init;