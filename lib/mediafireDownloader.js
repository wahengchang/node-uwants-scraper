const cheerio = require('cheerio')
const fs = require('fs')
const {getHtmlByFile} = require('./request')
const pMg = require('./processManager')


const get_html_by__css = ({id, url, css='body'}) => `casperjs ./lib/casperScraper/index.js --filename=${id} --cssClass=${css} --url=${url}`

const get_timestamp_by_url = (_mediafireUrl) => _mediafireUrl.substring(_mediafireUrl.lastIndexOf("Summit-")+7,_mediafireUrl.lastIndexOf(".mp3"));

module.exports = class Downloader {
    constructor (detailObj) {
        this.detailInfo = detailObj.info
        this.downloadList = detailObj.mediaFireUrl.map( url => ({
            url, 
            timestamp:  get_timestamp_by_url(url),
            mp3Link: null,
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
        downloadItem.mp3Link = link
        return 
    }

    async fetchMp3File(downloadItem) {
        const {timestamp, mp3Link} = downloadItem
        await pMg.execPromise(`curl -o ./temp/mp3/${timestamp}.mp3 ${mp3Link}`)
        downloadItem.mp3Path = `./temp/mp3/${timestamp}.mp3`
        return 
    }

    removeFile(path) {
        return fs.unlinkSync(path)
    }

    async exec() {
        console.log('exec: ...')
        const downloadList = this.downloadList
        
        for(let i =0 ; i< downloadList.length; i++){
            const downloadItem = downloadList[i]
            await this.fetchHtml(downloadItem)
            await this.scrapeMp3Link(downloadItem)
            await this.fetchMp3File(downloadItem)
            this.removeFile(downloadItem.htmlPath)
            this.removeFile(downloadItem.mp3Path)
        }
    }
}
