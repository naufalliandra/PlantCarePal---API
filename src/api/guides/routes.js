const GuidesHandlers = require('./handler');

module.exports = [
    {
        method: 'GET',
        path: '/guides',
        handler: GuidesHandlers.getAllGuides,
        options: { auth: 'jwt' }
    },
    {
        method: 'GET',
        path: '/guides/{id}',
        handler: GuidesHandlers.getGuideById,
        options: { auth: 'jwt' }
    }
];
