const getDB = require ('../../database/getDB');
const bcrypt = require ('bcrypt');
const { showError } = require('../../helpers');

const deleteUser = async (req, res, next) => {
   let connection;

   try {
       connection = await getDB();

       const { idMail } = req.body;

       const [userMail] = await connection.query (
         `SELECT * FROM user WHERE email = ?`,
         [idMail]
     )

     if (userMail.length < 1){
         throw showError('¡Ups! No hay usuarios registrados con ese mail.', 409)
     } 

       await connection.query(`DELETE FROM user WHERE email = ?`, [idMail]);
       res.send({
           status: 'Ok',
           message: 'Usuario eliminado correctamente.',
       });
   } catch (error) {
       next(error);
   } finally {
       if (connection) connection.release();
   }
};

module.exports = deleteUser;

