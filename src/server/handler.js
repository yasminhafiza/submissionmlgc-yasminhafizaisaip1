const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    try {
        const { label, suggestion, confidenceScore } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            "id": id,
            "result": label,
            "suggestion": suggestion,
            "createdAt": createdAt
        }

        await storeData(id, data);

        const response = h.response({
            status: 'success',
            message: confidenceScore > 50 ? 'Model is predicted successfully' : 'Model is predicted successfully',
            data
        });
        response.code(201);
        return response;
    } catch (error) {
        console.error('Error during prediction:', error);
        const response = h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
            error: error.message
        });
        response.code(400);
        return response;
    }
}

async function getHistoriesHandler(request, h) {
    const db = new Firestore({
        projectId: 'submissionmlgc-yasminhafizaip',
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    const predictCollection = db.collection('predictions');

    try {
        const snapshot = await predictCollection.get();
        const histories = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            histories.push({
                id: doc.id,
                history: data
            });
        });

        const response = h.response({
            status: 'success',
            data: histories
        });
        response.code(200);
        return response;
    } catch (error) {
        console.error('Error fetching histories:', error);
        const response = h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam mengambil riwayat prediksi',
            error: error.message
        });
        response.code(500);
        return response;
    }
}

module.exports = { postPredictHandler, getHistoriesHandler };