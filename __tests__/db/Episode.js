require('es6-promise').polyfill()
require('isomorphic-fetch')
require('../../lib/db/init')
const EpisodeClass = require('../../lib/db/Episode')

describe('db/Episode', async ()=>{
    beforeAll(()=>{
    })

    it('fetchById: happy path', async ()=>{
        const EpisodeDB = new EpisodeClass()
        const id = 'thread_19678252'
        
        const result = await EpisodeDB.fetchById(id)
        expect(result.id).toBe(id)
    })


    it('fetchById: fail', async ()=>{
        const EpisodeDB = new EpisodeClass()
        const id = 'something_wrong'
        
        const result = await EpisodeDB.fetchById(id)

        expect(result).toBe(null)
    })
})