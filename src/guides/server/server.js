const Hapi = require('@hapi/hapi');
const routes = require('./routes');

(async () => {
    const server = Hapi.server({
        port: 3030,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    await server.start();
    console.log(`Server started at: ${server.info.uri}`);
})();