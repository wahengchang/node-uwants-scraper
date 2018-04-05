const Abstract = require('./Abstract')
const {cArrayTojArray} = require('../cheerioUtil')

const _isKmdMp3Url = (url) => url.includes('www.mediafire.com')

module.exports = class TitleList extends Abstract{
    constructor (url, info = {}) {
        super(url)
        this.info = info
        this.isKmd = null
        this.mediaFireUrl = []
    }

    scrapingDetail() {
        const $ = this.$
        let isKmd = false
        const _returnData = []

        $('.defaultpost').find('a').map(function(i, element){
            const mp3Url = $(this).attr('href')
            _returnData.push($(this).attr('href'))
            if(_isKmdMp3Url(mp3Url)) isKmd = true
        }) 

        this.isKmd = isKmd
        return _returnData
    }

    getMediaFireUrl() {
        return this.mediaFireUrl
    }
    getIsKmd() {
        return this.isKmd
    }

    preProcess() {
        this.returnData = cArrayTojArray(this.scrapingDetail())
        this.mediaFireUrl = this.returnData.filter(_isKmdMp3Url)
        return this.returnData
    }
}