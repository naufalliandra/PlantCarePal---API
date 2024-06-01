const routes = require('./routes');

const mlApi = (server) => {
    server.route(routes);
};

module.exports = mlApi;