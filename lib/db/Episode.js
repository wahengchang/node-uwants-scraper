const Abstract = require('./Abstract')

const titleToDate = title => {
  const year = title.substring(title.indexOf('201'), title.indexOf('201')+4)
  const month = title.substring(title.indexOf('201')+5, title.indexOf('201')+7)
  const day = title.substring(title.indexOf('201')+8, title.indexOf('201')+10)
  return new Date(`${year}-${month}-${day}`)
}

module.exports = class Episode extends Abstract{
  constructor () {
      super('Episode')
  }

  preCreate(){
    const {id = '', title = '', url = '', downloadList = []} = this.createPayload
    const publishedDate = titleToDate(title).getTime() //timestamp
    const viewCount = 0, likeCount = 0
    const mp3Urls = downloadList.map(item => item.mp3Link)

    this.createPayload = {id, title, url, publishedDate, viewCount, likeCount, mp3Urls}
    return
  }
}