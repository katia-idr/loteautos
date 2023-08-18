
const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const { showError } = require('../../helpers')



const newUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const { nombre, apellido1, apellido2, email, password, rfc } = req.body;
        
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
   
           if (!rfc) {
                throw showError  ('¡Ups! Necesitas escribir el RFC de tu concesionaria.', 400);
                                } 

            const [user] = await connection.query (
                `SELECT id FROM user WHERE email = ?`,
                [email]
            )

            if (user.length > 0){
                throw showError('¡Ups! Ya existe un usuario registrado con ese mail.', 409)
            }

            const [rfcCheck] = await connection.query (
                `SELECT * FROM lote WHERE rfc = ?`,
                [rfc]
            )

            if (rfcCheck.length < 1){
                throw showError('¡Ups! No hay ninguna concesionaria registrada con ese RFC. Ponte en contacto con tu administrador para que haga el registro. ', 409)
            }
            const cryptoPass = await bcrypt.hash(password, 10);

            await connection.query(`
            insert into user (nombre, apellido1, apellido2, email, password, tipo, idLote, createdAt)
            values (?,?,?,?,?,?,?,?)`,
            [nombre, apellido1, apellido2, email, cryptoPass, 'user', rfcCheck[0].id, new Date()]);

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

module.exports = newUser;