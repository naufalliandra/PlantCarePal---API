const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeImage(image, 3)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat()
            .div(tf.scalar(255));

        const classes = ['...', '...'];

        const prediction = model.predict(tensor);
        const score = await prediction.data();

        const classResult = score[0] > 0.5 ? 0 : 1;
        const percentage = Math.max(...score) * 100;
        const diseasesName = classes[classResult];
        let suggestion;
        let description;
        
        if (diseasesName === '...') {
            description = "...";
            suggestion = "...";
        }

        return { diseasesName, description, percentage, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
