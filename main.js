const host = 'http://www.uwants.com'

const TitleListKmd = require('./lib/kmd/TitleListKmd')
const Detail = require('./lib/kmd/Detail')

module.exports = async function(){
    // process title list 
    const tl = new TitleListKmd(host + '/forumdisplay.php?fid=169')
    const titleInforList = await tl.getData() //[{id, title, url}]

    // process detail data
    const detailList = titleInforList.map(item => new Detail(host + item.url, item))
    await Promise.all(detailList.map(item => item.getData()))

    // get kmd only detail data
    const kmdDetailList = detailList.filter(item=> item.getIsKmd())
    // kmdDetailList.forEach(item => console.log(item.getMediaFireUrl()))

    const mfDownloader = require('./lib/mediafireDownloader')
    const mfInstance = new mfDownloader(kmdDetailList[0])
    mfInstance.exec()
}