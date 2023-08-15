
const getDB = require('../../database/getDB');
const { showError } = require('../../helpers')



const newLote = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const { nombre, razonsocial, rfc, direccion, telefono} = req.body;
        
        if (!nombre) {
            throw showError('¡Ups! Has olvidado escribir el nombre.', 400);
            }
             if (!razonsocial) {
               throw showError ('¡Ups! Has olvidado escribir la razón social.', 400);
               }
               if (!rfc) {
                throw showError ('¡Ups! Has olvidado escribir el RFC.', 400);
                }

               if (!direccion) {
                  throw showError('¡Ups! Has olvidado escribir la dirección.', 400);
                  }

                  if (!telefono) {
                     throw showError('¡Ups! Has olvidado escribir el teléfono.', 400);
                     } 


            const [lote] = await connection.query (
                `SELECT id FROM lote WHERE rfc = ?`,
                [rfc]
            )

            if (lote.length > 0){
                throw showError('¡Ups! Ya existe un lote registrado con ese RFC.', 409)
            } 


            await connection.query(`
            insert into lote (nombre, razonsocial, rfc, direccion, telefono, createdAt)
            values (?,?,?,?,?,?)`,
            [nombre, razonsocial, rfc, direccion, telefono, new Date()]);

            res.send({
                status: 'Ok',
                message: 'Lote registrado con éxito.'
            })
    

    } catch(error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newLote;