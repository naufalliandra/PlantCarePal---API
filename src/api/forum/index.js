const routes = require('./routes');

const forumApi = (server) => {
    server.route(routes);
};

module.exports = forumApi;
