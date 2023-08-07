const { savePhoto } = require('../helpers');
const getDB = require('../../Backend_loteautos/database/getDB');


async function insertPhoto(postPhotos, autoId) {
   let connection;
   try {
       connection = await getDB();

       let photosNames = [];

       for (let i = 0; i < postPhotos.length; i++) {
           const photoName = await savePhoto(postPhotos[i], 1);

           await connection.query(
               `INSERT INTO auto_photo (name, idAuto)
           VALUES (?,?)`,
               [photoName, autoId]
           );

           photosNames.push(photoName);
       }

       return photosNames;
   } finally {
       if (connection) connection.release();
   }
}




async function getAutosByOrderDirection() {
   let connection;
   try {
       connection = await getDB();

       const [autos] = await connection.query(
           `
           SELECT auto.id AS idAuto, lote.id AS idLote, auto.color, auto.puertas 
           FROM auto INNER JOIN lote ON auto.idLote = lote.id
           ORDER BY auto.createdAt DESC`
       );

       return autos;
   } finally {
       if (connection) connection.release();
   }
}





async function getAutosBySearch(search) {
   let connection;
   try {
       connection = await getDB();

       const [autos] = await connection.query(
           `
       SELECT auto.id AS idAutos,
       FROM auto INNER JOIN lote ON auto.idLote = lote.id
       ORDER BY post.createdAt DESC `,
           [`%${search}%`, `%${search}%`]
       );

       return autos;
   } finally {
       if (connection) connection.release();
   }
}



module.exports = {
   insertPhoto, getAutosBySearch, getAutosByOrderDirection,
}