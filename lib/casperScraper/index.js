
var casper = require('casper').create({
    pageSettings: {
        loadImages: false,//The script is much faster when this field is set to false
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
        logLevel: "debug",
        timeout: 10000
    }
});

// Command Example:
// casperjs lib/dynScraper/index.js --filename=foo --cssClass=foo --url=http://foo.com
var FILENAME = casper.cli.get('filename')
var WAITFOR_CLASS_NAME = casper.cli.get('cssClass')
var URL = casper.cli.get('url')

casper.start().thenOpen(URL, function() {
    console.log("[INFOR] Browser is opened ...")
    // console.log("[INFOR] Waiting for css : ", WAITFOR_CLASS_NAME)
});

casper.waitForSelector('.'+ WAITFOR_CLASS_NAME,
    function success() {
        // console.log("[INFOR] Going to download html ...")
        var fs = require('fs');
        var html = this.getHTML();
        var path = 'temp/html/' + FILENAME +'.html'
        fs.write(path, html, 'w');
        console.log('[INFOR] ' + FILENAME + '.html saved')
    },
    function fail(data) {
        console.log("[ERROR]")
        console.log(data)
    },
    3000
);

casper.run();