const getDB = require ('../../database/getDB');
const { showError, savePhoto } = require ('../../helpers')



const newAutoPhoto = async (req, res, next) => {
   let connection;

   try {
       connection = await getDB();

       const { idAuto } = req.params;

       const [photos] = await connection.query(
           `SELECT id FROM auto_photo WHERE idAuto = ?`,
           [idAuto]
       );



       if (photos.length >= 15) {
           throw showError(
               'Este auto ya tiene 15 fotos. No puedes agregar más.',
               403
           );
       }


       if (!req.files || !req.files.autoPhoto) {
           throw showError('¡Ups! Selecciona la foto que quieres añadir por favor.', 400);
       }

       const photoName = await savePhoto(req.files.autoPhoto, 1);

       await connection.query(
           `INSERT INTO auto_photo (name, idAuto)
           VALUES (?, ?)`,
           [photoName, idAuto]
       );

       res.send({
           status: 'Ok',
           message: '¡Listo! Se añadió la imagen seleccionada al auto.',
       });
   } catch (error) {
       next(error);
   } finally {
       if (connection) connection.release();
   }
};

module.exports = newAutoPhoto;
