var firebase = require("firebase-admin");

var serviceAccount = require("../../serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://test-23cfc.firebaseio.com"
});