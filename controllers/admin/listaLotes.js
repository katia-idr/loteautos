const getDB = require("../../database/getDB");
const { showError } = require("../../helpers");

const listaLotes = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const [lotes] = await connection.query(
            "SELECT * FROM lote ORDER BY nombre ASC",
        );

        res.send({
            status: "Ok",
            data: lotes,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = listaLotes;
