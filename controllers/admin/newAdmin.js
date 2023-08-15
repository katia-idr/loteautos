
const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const { showError } = require('../../helpers')



const newAdmin = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const { nombre, apellido1, apellido2, email, password } = req.body;
        
        if (!nombre) {
            throw showError('¡Ups! Has olvidado escribir tu nombre.', 400);
            }

        if (!apellido1) {
               throw showError ('¡Ups! Has olvidado escribir tu apellido.', 400);
               } 

       if (!email) {
                  throw showError  ('¡Ups! Has olvidado escribir tu mail', 400);
                  }

        if (!password) {
             throw showError  ('¡Ups! Has olvidado escribir una contraseña.', 400);
                     } 
   

            const [user] = await connection.query (
                `SELECT id FROM user WHERE email = ?`,
                [email]
            )

            if (user.length > 0){
                throw showError('¡Ups! Ya existe un usuario registrado con ese mail.', 409)
            }

            
            const cryptoPass = await bcrypt.hash(password, 10);

            await connection.query(`
            insert into user (nombre, apellido1, apellido2, email, password, tipo, createdAt)
            values (?,?,?,?,?,?,?)`,
            [nombre, apellido1, apellido2, email, cryptoPass, 'admin', new Date()]);

            res.send({
                status: 'Ok',
                message: 'Usuario registrado con éxito. ¡Bienvenido a Anabit!'
            })
    

    } catch(error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newAdmin;