const getDB = require("../../database/getDB");
const { showError } = require("../../helpers");

const profileUser = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const idUser = req.userAuth.id;

        const [user] = await connection.query(
            `SELECT id, nombre, apellido1, apellido2, email, tipo FROM user WHERE id = ?`,
            [idUser],
        );

        if (user.length < 1) {
            throw showError("No existe el usuario que estás buscando.", 404);
        }

        res.send({
            status: "ok",
            data: user[0],
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = profileUser;
