const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const showError = require ('../../helpers');

const editUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idUser = req.userAuth.id;
        const {
            nombre,
            apellido1,
            apellido2,
            email,
            oldPass,
            newPass,
        } = req.body;

        if (
            !(
                nombre ||
                apellido1 ||
                apellido2 ||
                oldPass ||
                newPass ||
                email ||
            )
        ) {
            throw showError('No has hecho ningún cambio.', 400);
        }

        const [[user]] = await connection.query(
            `select * from user where id = ?`,
            [idUser]
        );

        let userUrl;
        if (url) {
            if (!(url.includes('https://') || url.includes('http://'))) {
                userUrl = 'http://' + url;
            } else {
                userUrl = url;
            }
        }

        let hashedPassword = null;

        if (newPass && !oldPass) {
            throw showError(
                'Necesitas introducir la contraseña anterior.',
                400
            );
        }

        if (oldPass) {
            if (!newPass) {
                throw showError(
                    'Necesitas introducir una contraseña nueva.',
                    400
                );
            }
            const isValid = await bcrypt.compare(oldPass, user.password);

            if (!isValid) {
                throw generateError(
                    'Contraseña incorrecta. Intenta de nuevo.',
                    401
                );
            }
            hashedPassword = await bcrypt.hash(newPass, 10);
        }

        if (email) {
            const [[userWithSameEmail]] = await connection.query(
                `select id from user where email = ?`,
                [email]
            );
            if (userWithSameEmail) {
                throw generateError(
                    'Ya hay un usuario registrado con ese email.',
                    409
                );
            }
        }


        await connection.query(
            `
         update user set nombre = ?, apellido1 = ?, apellido2 = ?, password = ?, email = ? where id = ?`,
            [
                nombre || user.nombre,
                apellido1 || user.apellido1,
                apellido2 || user.apellido2,
                hashedPassword || user.password,
                email || user.email,
                idUser,
            ]
        );

        res.send({
            status: 'Ok',
            message:
                'Los datos de usuario han sido modificados con éxito.',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editUser;
