const ForumHandlers = require('./handler');

module.exports = [
    {
        method: 'GET',
        path: '/forum',
        handler: ForumHandlers.getAllQuestions,
        options: { auth: 'jwt' }
    },
    {
        method: 'GET',
        path: '/forum/{id}',
        handler: ForumHandlers.getQuestionById,
        options: { auth: 'jwt' }
    },
    {
        method: 'POST',
        path: '/forum',
        handler: ForumHandlers.postQuestion,
        options: { auth: 'jwt' }
    },
    {
        method: 'POST',
        path: '/forum/{id}/answers',
        handler: ForumHandlers.postAnswer,
        options: { auth: 'jwt' }
    }
];
