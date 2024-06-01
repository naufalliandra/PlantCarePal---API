const db = require('../../config/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const getAllQuestions = async (request, h) => {
    try {
        const questionsSnapshot = await db.collection('forum').get();
        const questions = [];
        questionsSnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() });
        });

        return { 
            status: 'success', 
            data: questions,
        };
    } catch (error) {
        console.error('Error getting questions:', error);
        return h.response({ 
            status: 'error', 
            message: 'Internal Server Error' 
        }).code(500);
    }
};

const getQuestionById = async (request, h) => {
    try {
        const { id } = request.params;
        const questionRef = db.collection('forum').doc(id);
        
        const questionDoc = await questionRef.get();
        const questionData = questionDoc.data();

        const answersSnapshot = await questionRef.collection('answers').get();
        const answers = [];
        answersSnapshot.forEach((doc) => {
            answers.push({ id: doc.id, ...doc.data() });
        });

        const questionWithAnswers = {
            id: questionDoc.id,
            ...questionData,
            answers: answers
        };

        return { 
            status: 'success', 
            data: questionWithAnswers,
        };
    } catch (error) {
        return h.response({ 
            status: 'error', 
            message: 'Internal Server Error' 
        }).code(500);
    }
};

const postQuestion = async (request, h) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'my_secret_key');
        const userId = decoded.user.id;

        const userSnapshot = await db.collection('users').doc(userId).get();
        if (!userSnapshot.exists) {
            return h.response({ 
                status: 'error', 
                message: 'User not found',
            }).code(404);
        }
        
        const { title, question } = request.payload;

        const userData = userSnapshot.data();
        const username = userData.username;
        
        const questionId = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        await db.collection("forum").doc(questionId).set({
            username,
            title,
            question,
            createdAt
        });

        return { 
            status: 'success', 
            message: 'Question posted successfully.' 
        };
    } catch (error) {
        console.error('Error getting guide by ID:', error);
        return h.response({ 
            status: 'error', 
            message: 'Internal Server Error' 
        }).code(500);
    }
};

const postAnswer = async (request, h) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'my_secret_key');
        const userId = decoded.user.id;

        const userSnapshot = await db.collection('users').doc(userId).get();
        if (!userSnapshot.exists) {
            return h.response({ 
                status: 'error', 
                message: 'User not found',
            }).code(404);
        }

        const userData = userSnapshot.data();
        const username = userData.username;

        const { id } = request.params;
        const { answer } = request.payload;
        const answerId = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        await db.collection("forum").doc(id).collection("answers").doc(answerId).set({
            username,
            answer,
            createdAt
        });

        return { 
            status: 'success', 
            message: 'Answer posted successfully.',
        };
    } catch (error) {
        return h.response({ 
            status: 'error', 
            message: 'Internal Server Error' 
        }).code(500);
    }
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    postQuestion,
    postAnswer
};
