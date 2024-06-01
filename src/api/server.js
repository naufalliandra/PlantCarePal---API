const Hapi = require('@hapi/hapi');
const authApi = require('./auth');
const guidesApi = require('./guides');
const forumApi = require('./forum');
// const mlApi = require('./ml');
const InputError = require('../exceptions/InputError');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register(require('@hapi/inert'));
    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt', {
        key: 'my_secret_key',
        validate: async (decoded, request, h) => {
            return { isValid: true };
        },
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');

    // Registrasi rute dari masing-masing modul
    authApi(server);
    guidesApi(server);
    forumApi(server);
    // mlApi(server);

    server.ext('onPreResponse', (request, h) => {
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: "Payload content length greater than maximum allowed: 1000000"
            });
            newResponse.code(413);
            return newResponse;
        }

        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: "An error occurred while making the prediction."
            });
            newResponse.code(400);
            return newResponse;
        }

        return h.continue; 
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

init();
