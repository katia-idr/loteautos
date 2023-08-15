const getDB = require('../database/getDB')
const { showError } = require("../helpers");

const isAdmin = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const idReqUser = req.userAuth.id;
       

        const [users] = await connection.query (`
        select tipo from user where id =?`,
        [idReqUser]);

        if (users[0].tipo !== 'admin'){
            throw showError ('Lo siento, no puedes realizar esta acción. No tienes perfil de administrador.', 401)
        }

        next();

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};
module.exports = isAdmin;