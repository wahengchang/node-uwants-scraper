const Abstract = require('./Abstract')

module.exports = class TitleList extends Abstract{
    constructor (url) {
        super(url)
    }

    scrapingTitle() {
        const $ = this.$
        return $('tbody').map(function(i, element){
            const id = $(this).find('span').attr('id');
            const url = '/' + $(this).find('span a').attr('href');
            const title = $(this).find('span a').text();
    
            return url ? {id, url, title} : null
        }) 
    }

    preProcess() {
        this.returnData = this.scrapingTitle()
    }
}