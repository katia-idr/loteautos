
const getDB = require('../../database/getDB');
const { showError } = require('../../helpers');




const newAuto = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const { placa, vin, marca, modelo, año, version, tipo, color, puertas, dobletraccion, kilometraje, adquisicion, entidadplaca, fechaadqui, preciocompra, precioventa, comentarios} = req.body;
        
        if (!placa) {
            throw showError('¡Ups! Has olvidado escribir la placa.', 400);
            }

           if (!vin) {
               throw showError('¡Ups! Has olvidado escribir el número VIN.', 400);
               } 


            let [auto] = await connection.query (
                `SELECT id FROM auto WHERE placa = ?`,
                [placa]
            )

            if (auto.length > 0){
                throw showError('¡Ups! Ya existe un auto registrado con esa placa.', 409)
            }

             [auto] = await connection.query (
                `SELECT id FROM auto WHERE vin = ?`,
                [vin]
            )

            if (auto.length > 0){
                throw showError('¡Ups! Ya existe un auto registrado con ese VIN.', 409)
            }


            await connection.query(`
            insert into auto (placa, vin, marca, modelo, año, version, tipo, color, puertas, dobletraccion, kilometraje, adquisicion, entidadplaca, fechaadqui, preciocompra, precioventa, idLote, comentarios )
            values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [placa, vin, marca, modelo, año, version, tipo, color, puertas, dobletraccion, kilometraje, adquisicion, entidadplaca, fechaadqui, preciocompra, precioventa, req.loteId, comentarios, Date()]);

            res.send({
                status: 'Ok',
                message: 'Auto registrado con éxito.'
            })
    

    } catch(error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newAuto;