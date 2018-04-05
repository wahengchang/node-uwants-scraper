require('es6-promise').polyfill();
require('isomorphic-fetch');

(async() => { await require('./main')() })()