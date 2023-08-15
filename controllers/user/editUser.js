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
        const { nombre, apellido1, apellido2, email} = req.body;

        
        // Recuperamos los datos del usuario para no modificar datos a nulo
        const [user] = await connection.query(
            `SELECT * FROM user WHERE id = ?`,
            [idUser]
        );



        // Actualizamos los campos del usuario según lo que cubra
        await connection.query(
            `UPDATE user SET nombre = ?, apellido1 = ?, apellido2 = ?, email=? WHERE id = ?`,
            [nombre || user[0].nombre, apellido1 || user[0].apellido1, apellido2 || user[0].apellido2, email || user[0].email, idUser]);

            

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
