
require("dotenv").config();
const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const { showError } = require('../../helpers')
const jwt = require('jsonwebtoken');




const logUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email, password } = req.body;
        if (!email || !password) {
            throw showError (
                '¿Pusiste el usuario y la contraseña?',
                400
            );
        }

        const [[user]] = await connection.query(
            `select password, id from user where email = ?`,
            [email]
        );

        if (!user) {
            throw showError(
                'Lo siento. No tenemos usuarios registrados con ese email.',
                404
            );
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            throw showError(
                'La contraseña que has introducido es incorrecta.',
                401
            );
        }

        const tokenInfo = {
            id: user.id,
        };

        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '10d',
        });

        res.send({
            status: 'Ok',
            message: '¡Bienvenido!',
            authToken: token,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = logUser;
