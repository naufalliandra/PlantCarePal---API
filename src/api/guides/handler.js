const db = require('../../config/db');

const getAllGuides = async (request, h) => {
    try {
        const guidesSnapshot = await db.collection('guides').get();
        const guides = [];
        guidesSnapshot.forEach((doc) => {
            guides.push({ id: doc.id, ...doc.data() });
        });
        return { status: 'success', data: guides };
    } catch (error) {
        console.error('Error getting guides:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

const getGuideById = async (request, h) => {
    try {
        const { id } = request.params;
        
        const guideDoc = await db.collection('guides').doc(id).get();
        if (!guideDoc.exists) {
            return h.response({ message: 'Guide not found' }).code(404);
        }
        const guideData = guideDoc.data();
        return { status: 'success', data: guideData };
    } catch (error) {
        console.error('Error getting guide by ID:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    getAllGuides,
    getGuideById
};
