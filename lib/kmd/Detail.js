const Abstract = require('./Abstract')
const EpisodeClass = require('../db/Episode')
const {cArrayTojArray} = require('../cheerioUtil')

const _isKmdMp3Url = (url) => url.includes('www.mediafire.com')

module.exports = class TitleList extends Abstract{
    constructor (url, info = {}) {
        super(url)
        this.info = info
        this.isKmd = null
        this.isExisted = null
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

    getIsExisted() {
        return this.isExisted
    }

    async preProcess() {
        this.returnData = cArrayTojArray(this.scrapingDetail())
        this.mediaFireUrl = this.returnData.filter(_isKmdMp3Url)

        const EpisodeDB = new EpisodeClass()
        this.isExisted = ((await EpisodeDB.fetchById(this.info.id)) === null )? false : true
        this.isKmd = (this.info.title.length > 100)? false : this.isKmd

        return this.returnData
    }
}