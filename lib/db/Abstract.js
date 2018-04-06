var firebase = require("firebase-admin");
var db = firebase.database();

module.exports = class Abstract {
    constructor (CLASS_NAME, option={}) {
        this.CLASS_NAME = CLASS_NAME
        this.ref = db.ref(CLASS_NAME);
        this.refChild = option.refChild || 'data'
        this.createPayload = null
        this.init()
    }

    init () {
        this.ref.once("value", function(snapshot) {
        //   console.log(snapshot.val());
        });
        this.ref.child(this.refChild);
    }

    preCreate(){
        return this.createPayload
    }

    create(_payload) {
        this.createPayload = _payload

        this.preCreate()

        return this.ref.child(_payload.id).set(this.createPayload)
    }

    fetchById(id){
        const url = `https://test-23cfc.firebaseio.com/${this.CLASS_NAME}/${id}.json`
        return fetch(url).then(res => res.json())
    }
}
