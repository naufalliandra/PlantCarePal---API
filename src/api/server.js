const Hapi = require('@hapi/hapi');
const authApi = require('./auth');
const guidesApi = require('./guides');
const forumApi = require('./forum');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    await server.register(require('@hapi/inert'));
    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('jwt', 'jwt', {
        key: 'my_secret_key',
        validate: async (decoded, request, h) => {
            // Implementasikan validasi pengguna di sini
            return { isValid: true };
        },
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');

    // Registrasi rute dari masing-masing modul
    authApi(server);
    guidesApi(server);
    forumApi(server);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
