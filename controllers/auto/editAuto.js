const getDB = require("../../database/getDB");


const editAuto = async (req,res, next) => {
   let connection;

   try {
      connection = await getDB();

      const {idAuto} = req.params;

      const { placa, marca, modelo, year, version, tipo, color, puertas, dobletraccion, kilometraje, adquisicion, entidadplaca, fechaadqui, preciocompra, precioventa, comentarios } = req.body;

      const [auto] = await connection.query (`SELECT * FROM auto where id =?`,[idAuto]);

      console.log()

      await connection.query(`UPDATE auto SET placa=?, marca=?, modelo=?, year=?, version=?, tipo=?, color=?, puertas=?, dobletraccion=?, kilometraje=?, adquisicion=?, entidadplaca=?, fechaadqui=?, preciocompra=?, precioventa=?, comentarios=? where id =?` ,
      [
         placa || auto[0].placa,
         marca || auto[0].marca,
         modelo || auto[0].modelo,
         year || auto[0].year,
         version || auto[0].version,
         tipo || auto[0].tipo,
         color || auto[0].color,
         puertas || auto[0].puertas,
         dobletraccion || auto[0].dobletraccion,
         kilometraje || auto[0].kilometraje,
         adquisicion || auto[0].adquisicion,
         entidadplaca || auto[0].entidadplaca,
         fechaadqui || auto[0].fechaadqui,
         preciocompra || auto[0].preciocompra,
         precioventa || auto[0].precioventa, 
         comentarios || auto[0].comentarios,
         idAuto
      ]);

      res.send({
         status: 'Ok',
         message:'Datos modificados con éxito.'
      })
      
   } catch (error) {
      next (error)
   } finally {
      if (connection) connection.release();
   }
}


module.exports = editAuto