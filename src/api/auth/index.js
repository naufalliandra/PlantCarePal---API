const routes = require('./routes');

const authApi = (server) => {
    server.route(routes);
};

module.exports = authApi;