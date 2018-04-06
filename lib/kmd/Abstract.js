const cheerio = require('cheerio')
const {getHtml} = require('../request')
const {cArrayTojArray} = require('../cheerioUtil')

module.exports = class Abstract {
    constructor (url) {
        this.url = url
        this.returnData = {}
        this.isInit = false
    }

    async init () {
        this.html = await getHtml(this.url)
        this.$ = cheerio.load(this.html);
    }

    preProcess() {
        return this.returnData = {}
    }

    async getData(msg) {
        if(this.isInit) return this.returnData

        await this.init()
        await this.preProcess()
        return cArrayTojArray(this.returnData)
    }
}
