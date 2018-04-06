const cheerio = require('cheerio')
const fs = require('fs')
const {getHtmlByFile} = require('./request')
const storage = require('./storage')
const pMg = require('./processManager')

const EpisodeClass = require('./db/Episode')
const EpisodeDB = new EpisodeClass()


const get_html_by__css = ({id, url, css='body'}) => `casperjs ./lib/casperScraper/index.js --filename=${id} --cssClass=${css} --url=${url}`

const get_timestamp_by_url = (_mediafireUrl) => _mediafireUrl.substring(_mediafireUrl.lastIndexOf("Summit-")+7,_mediafireUrl.lastIndexOf(".mp3"));

module.exports = class Downloader {
    constructor (detailObj) {
        this.detailInfo = detailObj.info
        this.downloadList = detailObj.mediaFireUrl.map( url => ({
            url, 
            timestamp:  get_timestamp_by_url(url),
            mp3MFLink: null,
            mp3Path: null,
            htmlPath: null
        }))
    }

    async fetchHtml(downloadItem) {
        const {timestamp, url} = downloadItem
        await pMg.execPromise(get_html_by__css({
            id: timestamp, 
            url, 
            css: 'download_link'
        }))
        downloadItem.htmlPath = `./temp/html/${timestamp}.html`
        return 
    }

    async scrapeMp3Link(downloadItem) {
        const {timestamp} = downloadItem
        const html = await getHtmlByFile(`./temp/html/${timestamp}.html`)
        const $ = cheerio.load(html);
        const link = $('.download_link a').attr('href')
        downloadItem.mp3MFLink = link
        return 
    }

    async fetchMp3File(downloadItem) {
        const {mp3MFLink, timestamp} = downloadItem
        await pMg.execPromise(`curl -o ./temp/mp3/${timestamp}.mp3 ${mp3MFLink}`)
        downloadItem.mp3Path = `./temp/mp3/${timestamp}.mp3`
        return 
    }

    async uploadMp3File(downloadItem) {
        const {mp3Path} = downloadItem
        downloadItem.mp3Link = await storage.upload(mp3Path)
        return 
    }

    removeFile(path) {
        return fs.unlinkSync(path)
    }

    async exec() {
        console.log(`[INFOR] Exec: ${this.detailInfo.title}`)
        const downloadList = this.downloadList
        
        for(let i =0 ; i< downloadList.length; i++){
            const downloadItem = downloadList[i]
            await this.fetchHtml(downloadItem)
            await this.scrapeMp3Link(downloadItem)
            await this.fetchMp3File(downloadItem)

            console.log('[INFOR] Uploading mp3 ')
            await this.uploadMp3File(downloadItem)
        }

        console.log('[INFOR] Writing meta to DB ')
        await EpisodeDB.create({
            ...this.detailInfo,
            downloadList: downloadList
        })

        console.log('[INFOR] Deleting temp file')
        for(let i =0 ; i< downloadList.length; i++){
            const downloadItem = downloadList[i]
            this.removeFile(downloadItem.htmlPath)
            this.removeFile(downloadItem.mp3Path)
        }

        console.log('[INFOR] Done')
    }
}
