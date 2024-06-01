const db = require('../../config/db');

const getAllGuides = async (request, h) => {
    try {
        const guidesSnapshot = await db.collection('guides').get();
        const guides = [];
        guidesSnapshot.forEach((doc) => {
            guides.push({ id: doc.id, ...doc.data() });
        });

        return { 
            status: 'success', 
            data: guides 
        };
    } catch (error) {
        return h.response({ 
            status: 'error',
            message: 'Internal Server Error' 
        }).code(500);
    }
};

const getGuideById = async (request, h) => {
    try {
        const { id } = request.params;

        const guideRef = db.collection('guides').doc(id);
        const guideDoc = await guideRef.get();
        
        if (guideDoc.empty) {
            return h.response({ 
                status: 'fail',
                message: 'Guide not found.' 
            }).code(404);
        }

        const guideData = guideDoc.data();
        console.log(h);
        return { 
            status: 'success', 
            data: guideData
        };
    } catch (error) {
        return h.response({ 
            status: 'error',
            message: 'Internal Server Error' 
        }).code(500);
    }
};


module.exports = {
    getAllGuides,
    getGuideById
};
