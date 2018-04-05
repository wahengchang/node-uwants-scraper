const TitleList = require('./TitleList')
const {cArrayTojArray} = require('../cheerioUtil')

const isKmd = ({title, url}) => {
    return (title.includes('光明頂') && !url.includes('##'))
}

module.exports = class TitleListKmd extends TitleList{
    constructor (url) {
        super(url)
    }

    preProcess() {
        super.preProcess()
        this.returnData = cArrayTojArray(this.returnData).filter(isKmd)
        return this.returnData
    }
}