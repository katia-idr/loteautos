const getDB = require ('../../database/getDB');
const bcrypt = require ('bcrypt');
const { showError } = require('../../helpers');

const deleteUser = async (req, res, next) => {
   let connection;

   try {
       // Abrimos una nueva conexion a la base de datos
       connection = await getDB();

       // Obtenemos el mail del usuario a borrar
       const { idMail } = req.body;

       // Comprobar que si hay usuarios con ese mail
       const [userMail] = await connection.query (
         `SELECT * FROM user WHERE email = ?`,
         [idMail]
     )

     if (userMail.length < 1){
         throw showError('¡Ups! No hay usuarios registrados con ese mail.', 409)
     } 

       // Borramos el usuario de la base de datos
       await connection.query(`DELETE FROM user WHERE email = ?`, [idMail]);

       res.send({
           status: 'Ok',
           message: 'Usuario eliminado correctamente.',
       });
   } catch (error) {
       // En caso de error, lo pasamos al siguiente middleware (el de error)
       next(error);
   } finally {
       // Siempre al final de este controlador soltaremos la conexión si esta existe
       if (connection) connection.release();
   }
};

module.exports = deleteUser;

