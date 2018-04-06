const host = 'http://www.uwants.com'

const TitleListKmd = require('./lib/kmd/TitleListKmd')
const Detail = require('./lib/kmd/Detail')
const mfDownloader = require('./lib/mediafireDownloader')

const processUwantsPage = async url => {
    // process title list 
    const tl = new TitleListKmd(url)
    const titleInforList = await tl.getData() //[{id, title, url}]

    // process detail data
    const detailList = titleInforList.map(item => new Detail(host + item.url, item))
    await Promise.all(detailList.map(item => item.getData()))

    // get kmd only detail data
    const kmdDetailList = detailList.filter(item=> item.getIsKmd()&& !item.getIsExisted())

    const mfInstanceList = kmdDetailList.map( kmdItem => new mfDownloader(kmdItem) )
    
    for(let i=0; i<mfInstanceList.length; i++){
        await mfInstanceList[i].exec()
    }
}

// started by 1
const getPageByNum = num => {
    const defaultUrl = '/forumdisplay.php?fid=169'

    if(num <= 1) return defaultUrl

    return `${defaultUrl}&page=${num}`
}

module.exports = async function(){
    for(let i=1; i<40; i++){
        console.log('[INFOR] Going to process UWants page ' + i)
        const url = host + getPageByNum(i)
        await processUwantsPage(url)
    }

    console.log(' -=-=-=-=-=-=-=-= done -=-=-=-=-=-=-=-=')
    process.exit()
}