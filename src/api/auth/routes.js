const AuthHandlers = require('./handler');

module.exports = [
    {
        method: 'POST',
        path: '/register',
        options: { auth: false },
        handler: AuthHandlers.register
    },
    {
        method: 'POST',
        path: '/login',
        options: { auth: false },
        handler: AuthHandlers.login
    },
];
