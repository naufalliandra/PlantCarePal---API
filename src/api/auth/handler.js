const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

const register = async (request, h) => {
    try {
        const { username, password } = request.payload;

        const usersSnapshot = await db.collection('users').where('username', '==', username).get();
        if (!usersSnapshot.empty) {
            return h.response({ 
                status: 'fail', 
                message: 'Username already exists.' 
            }).code(409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = crypto.randomUUID();
        await db.collection("users").doc(userId).set({
            id: userId,
            username,
            password: hashedPassword
        });

        return h.response({ 
            status: 'success',
            message: 'User registered successfully.' 
        }).code(201);
    } catch (error) {
        return h.response({ 
            status: 'error', 
            message: 'Internal Server Error' 
        }).code(500);
    }
};

const login = async (request, h) => {
    try {
        const { username, password } = request.payload;
        const userSnapshot = await db.collection('users').where('username', '==', username).get();
        if (userSnapshot.empty) {
            return h.response({ 
                status: 'fail',
                message: 'Invalid username or password' 
            }).code(400);
        }

        const userData = userSnapshot.docs[0].data();
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return h.response({ 
                status: 'fail',
                message: 'Invalid username or password' 
            }).code(400);
        }

        const user = { id: userData.id };
        const token = jwt.sign({ user }, "my_secret_key");

        return { token };
    } catch (error) {
        console.error('Error during login:', error);
        return h.response({ 
            status: 'error', 
            message: 'Internal Server Error' 
        }).code(500);
    }
};

module.exports = {
    register,
    login,
};
