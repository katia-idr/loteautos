const getDB = require ('../../database/getDB');
const bcrypt = require('bcrypt');
const { showError } = require('../../helpers');

const saltRounds = 10;

const editUserPass = async (req, res, next) => {
    let connection;

    try {
        // Abrimos una nueva conexion a la base de datos
        connection = await getDB();

        // Obtenemos el id del usuario a modificar
        const { idUser } = req.params;

        // Vamos a pedir que nos indique la contraseña antigua y la nueva
        const { oldPass, newPass } = req.body;

        // Si no existe alguna de estas lanzamos un error
        if (!oldPass) {
            throw showError(
                'Asegúrate de escribir tu contraseña actual.',
                400
            );
        }

        if (!newPass) {
         throw showError(
             'Tienes que escribir una contraseña nueva.',
             400
         );
     }
        // Obtenemos la contraseña antigua de la base de datos
        const [user] = await connection.query(
            `SELECT password FROM user WHERE id = ?`,
            [idUser]
        );

        // Guardamos en una variable la contraseña como un valor booleano, contraseña correcta o incorrecta
        const isValid = await bcrypt.compare(oldPass, user[0].password);

        // Si la contraseña antigua no es la misma de la base de datos lanzamos un error
        if (!isValid) {
            throw showError(
                'La contraseña antigua no coincide con la almacenada en la base de datos.',
                401
            );
        }

        // Si está correcta, hasheamos la contraseña nueva
        const hashedPassword = await bcrypt.hash(newPass, saltRounds);

        // Actualizamos la contraseña en la base de datos
        await connection.query(`UPDATE user SET password = ? WHERE id = ?`, [
            hashedPassword,
            idUser,
        ]);

        res.send({
            status: 'Ok',
            message: 'Contraseña actualizada',
        });
    } catch (error) {
        // En caso de error, lo pasamos al siguiente middleware (el de error)
        next(error);
    } finally {
        // Siempre al final de este controlador soltaremos la conexión si esta existe
        if (connection) connection.release();
    }
};

module.exports = editUserPass;