const { postDetectHandler, historiesDetectHandler } = require('./handler');

const routes = [
    {
        path: '/detect',
        method: 'POST',
        handler: postDetectHandler,
        options: {
            payload: {
                auth: 'jwt',
                maxBytes: 1000000,
                parse: true,
                output: 'stream',
                allow: 'multipart/form-data',
                multipart: true,
            }
        }
    },
    {
        path: '/detect/histories',
        method: 'GET',
        handler: historiesDetectHandler,
        options: { auth: 'jwt' }
    }
];

module.exports = routes;
