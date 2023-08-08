const getDB = require('../../database/getDB');
const { showError } = require('../../helpers');

const editUser = async (req, res, next) => {
    let connection;

    try {
        // Abrimos una nueva conexion a la base de datos
        connection = await getDB();

        // Recuperamos el id del usuario a actualizar
        const { idUser } = req.params;

        // Recuperamos los datos del body
        const { nombre, apellido1, apellido2, email } = req.body;

        // Recuperamos los datos del usuario para no modificar datos a nulo
        const [user] = await connection.query(
            `SELECT * FROM user WHERE id = ?`,
            [idUser]
        );

        // Podríamos comprobar si falta algun dato obligatorio
        if (!nombre) {
            throw showError(
                'Por favor escribe tu nombre.',
                400
            );
        }

        if (!apellido1) {
            throw showError(
                'Por favor escribe tu apellido.',
                400
            );
        }


        //Comprobar que no haya otro usuario con el mismo mail
        const [userMail] = await connection.query (
            `SELECT id FROM user WHERE email = ?`,
            [email]
        )

        if (userMail.length > 0){
            throw showError('¡Ups! Ya existe un usuario registrado con ese mail.', 409)
        }

        // Actualizamos los campos del usuario según lo que cubra
        await connection.query(
            `UPDATE user SET nombre = ?, apellido1 = ?, apellido2 = ?, email = ? WHERE id = ?`,
            [nombre || apellido1 || apellido2 || email || user[0].email, idUser]
        );

        res.send({
            status: 'Ok',
            message: 'Datos del usuario modificados con éxito',
        });
    } catch (error) {
        // En caso de error, lo pasamos al siguiente middleware (el de error)
        next(error);
    } finally {
        // Siempre al final de este controlador soltaremos la conexión si esta existe
        if (connection) connection.release();
    }
};


module.exports = editUser;
