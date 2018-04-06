require('es6-promise').polyfill();
require('isomorphic-fetch');

(async() => {
    require('./lib/db/init')
    require('./lib/storage').init()
    await require('./main')()
})()