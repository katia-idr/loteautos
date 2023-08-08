const getDB = require('../../database/getDB');
const { showError } = require('../../helpers')



const profileUser = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const token = req.headers.authorization;

        const { idUser } = req.params;


        let user;
        if (!token) {
            [user] = await connection.query(
                `SELECT id, nombre, apellido1, apellido2, email, tipo FROM user WHERE id = ?`,
                [idUser]
            );

            if (user.length === 0) {
                throw showError(
                    'No existe el perfil que estas buscando.',
                    404
                );
            } 

        } else {
            [user] = await connection.query(
                `SELECT id, name, username, email, lastname, avatar, bio, privacy, url FROM user WHERE id = ?`,
                [idUser]
            );
        }

        if (user.length === 0) {
            throw showError(
                'No existe el usuario que estás buscando.',
                404
            );
        }

        
        res.send({
            status: 'ok',
            data: user,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = profileUser;
