const {Firestore} = require('@google-cloud/firestore');
const dotenv = require('dotenv');

dotenv.config();

const db = new Firestore({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.FIRESTORE_KEY_FILE,
});

module.exports = db;