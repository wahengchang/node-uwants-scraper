const {init, upload} = require('../lib/storage')

describe('storage', async ()=>{
    beforeAll(()=>{
        init()
    })

    it('upload', async ()=>{
        const downloadUrl = await upload('./starter.js')
        expect(downloadUrl.includes('https://s3.amazonaws.com')).toBe(true)
    })
})