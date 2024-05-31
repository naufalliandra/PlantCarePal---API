const routes = require('./routes');

const guidesApi = (server) => {
    server.route(routes);
};

module.exports = guidesApi;