const getDB = require("../../database/getDB");
const { showError } = require('../../helpers')




const getAuto = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idAuto } = req.params;

        // Recuperamos la info del producto de la base de datos
        const [auto] = await connection.query(
            `SELECT * FROM auto WHERE id = ?`,
            [idAuto]
        );

        // Si esto no devuelve nada es que no se ha encontrado ese producto
        if (auto.length < 1) {
            throw showError(
                '¡Ups! No hemos encontrado el auto seleccionado.',
                404
            );
        }

        // Recuperamos las fotos del producto
        const [photos] = await connection.query(
            `SELECT name FROM auto_photo WHERE idAuto = ?`,
            [idAuto]
        );

        // Como solo devolvemos un único producto podemos crear un objeto "datos" que devuelva
        // la única posición del select de producto (product[0]) junto a todas las fotos que tenga asociadas
        let data = {
            product: auto[0],
            photos,
        };

        res.send({
            status: 'Ok',
            data,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getAuto;

