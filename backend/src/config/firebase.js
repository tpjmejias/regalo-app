const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

module.exports = { auth, db }; 