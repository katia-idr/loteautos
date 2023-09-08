const getDB = require("../../database/getDB");
const { showError, savePhoto } = require("../../helpers");

const newAuto = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const {
            placa,
            vin,
            marca,
            modelo,
            year,
            version,
            tipo,
            color,
            puertas,
            dobletraccion,
            kilometraje,
            adquisicion,
            entidadplaca,
            fechaadqui,
            preciocompra,
            precioventa,
            comentarios,
            loteId,
        } = req.body;

        if (!placa) {
            throw showError("¡Ups! Has olvidado escribir la placa.", 400);
        }

        if (!vin) {
            throw showError("¡Ups! Has olvidado escribir el número VIN.", 400);
        }

        let [auto] = await connection.query(
            `SELECT id FROM auto WHERE placa = ?`,
            [placa],
        );

        if (auto.length > 0) {
            throw showError(
                "¡Ups! Ya existe un auto registrado con esa placa.",
                409,
            );
        }

        [auto] = await connection.query(`SELECT id FROM auto WHERE vin = ?`, [
            vin,
        ]);

        if (auto.length > 0) {
            throw showError(
                "¡Ups! Ya existe un auto registrado con ese VIN.",
                409,
            );
        }

        const loteIdToSave = req.loteId || loteId;
        if (!loteIdToSave) {
            throw showError("El lote es un dato obligatorio.", 409);
        }

        await connection.query(
            `
            insert into auto (placa, vin, marca, modelo, year, version, tipo, color, puertas, dobletraccion, kilometraje, adquisicion, entidadplaca, fechaadqui, preciocompra, precioventa, idLote, comentarios )
            values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                placa,
                vin,
                marca,
                modelo,
                year,
                version,
                tipo,
                color,
                puertas,
                dobletraccion,
                kilometraje,
                adquisicion,
                entidadplaca,
                fechaadqui,
                preciocompra,
                precioventa,
                loteIdToSave,
                comentarios,
                Date(),
            ],
        );

        //Hacer consulta para recuperar id del auto
        const autoData = await connection.query(
            `select * from auto where placa = ?`,
            placa,
        );
        const idAuto = autoData[0][0].id;

        if (req.files.autoPhoto) {
            const [photos] = await connection.query(
                `SELECT id FROM auto_photo WHERE idAuto = ?`,
                [idAuto],
            );

            if (photos.length >= 15) {
                throw showError(
                    "Este auto ya tiene 15 fotos. No puedes agregar más.",
                    403,
                );
            }

            const newPhotos = Array.isArray(req.files.autoPhoto) ? req.files.autoPhoto : [req.files.autoPhoto];

            const imagesToUpload = newPhotos.map(async (file) => {
                const photoName = await savePhoto(file, 1);

                await connection.query(
                    `INSERT INTO auto_photo (name, idAuto)
                        VALUES (?, ?)`,
                    [photoName, idAuto],
                );
            });

            await Promise.all(imagesToUpload);
        }

        res.send({
            status: "Ok",
            message: "Auto registrado con éxito.",
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newAuto;
