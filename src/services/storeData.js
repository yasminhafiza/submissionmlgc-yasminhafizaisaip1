
const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
    const db = new Firestore({
        projectId: 'submissionmlgc-yasminhafizaip',
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    const predictCollection = db.collection('predictions');
    return predictCollection.doc(id).set(data);
}

module.exports = storeData;
