const getDB = require('../database/getDB');
const jwt = require('jsonwebtoken');
const { showError } = require('../helpers');
require('dotenv').config();

const tokenMatches = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();
        const { authorization } = req.headers;

        if (!authorization) {
            throw showError(
                'No estás autorizado para realizar esta acción. ¿Has hecho login?',
                401
            );
        }

        let tokenInfo;

        try {
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (error) {
            throw showError('No has iniciado sesión.', 401);
        }

        const [[user]] = await connection.query(
            `select * from user where id = ?`,
            [tokenInfo.id]
        );


        
        if (!user) {
            throw showError(
                '¡Ups! Algo salió mal. Inicia sesión nuevamente por favor.',
                401
            );
        }

        req.userAuth = tokenInfo;

        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = tokenMatches;
