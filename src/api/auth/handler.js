const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

const register = async (request, h) => {
    try {
        const { username, password } = request.payload;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = crypto.randomUUID();
        await db.collection("users").doc(userId).set({
            username,
            password: hashedPassword
        });
        const user = { id: userId };
        const token = jwt.sign({ user }, "my_secret_key");
        return { token };
    } catch (error) {
        console.error('Error during registration:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

const login = async (request, h) => {
    try {
        const { username, password } = request.payload;
        const userSnapshot = await db.collection('users').where('username', '==', username).get();
        if (userSnapshot.empty) {
            return h.response({ message: 'Invalid username or password' }).code(400);
        }
        const userData = userSnapshot.docs[0].data();
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return h.response({ message: 'Invalid username or password' }).code(400);
        }
        const user = { id: userData.id };
        const token = jwt.sign({ user }, "my_secret_key");
        return { token };
    } catch (error) {
        console.error('Error during login:', error);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    register,
    login,
};
