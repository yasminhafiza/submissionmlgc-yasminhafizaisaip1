
const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeImage(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = score[0] * 100;

        const classes = ['Non-cancer', 'Cancer'];
        const label = confidenceScore > 50 ? 'Cancer' : 'Non-cancer';

        const suggestion = label === 'Cancer' ? 'Segera periksa ke dokter!' : 'Anda sehat!';

        return { label, suggestion, confidenceScore }
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}

module.exports = predictClassification;
