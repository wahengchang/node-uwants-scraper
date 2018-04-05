const fs = require('fs')

const getHtml = url => fetch(url)
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.text();
    })

const getHtmlByFile = path => Promise.resolve(fs.readFileSync(path, 'utf8'))

module.exports = {getHtml, getHtmlByFile}