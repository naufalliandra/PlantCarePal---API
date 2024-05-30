const { getAllGuidesHandler, getGuideHandler } = require('./handler');

const routes = [
    {
        path: '/guides',
        method: 'GET',
        handler: getAllGuidesHandler
    },
    {
        path: '/guides/{id}',
        method: 'GET',
        handler: getGuideHandler
    },
];

module.exports = routes;
