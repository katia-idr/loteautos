const getDB = require("../../database/getDB");


const editAuto = async (req,res, next) => {
   let connection;

   try {
      connection = await getDB();

      const {idAuto} = req.params;

      const { precioventa, comentarios} = req.body;

      const [auto] = await connection.query (`SELECT * FROM auto where id =?`,[idAuto]);

      await connection.query(`UPDATE auto SET precioventa=?, comentarios=?`,[precioventa || auto[0].precioventa, comentarios || auto[0].comentarios]);

      res.send({
         status: 'Ok',
         message:'Precio venta y/o comentarios modificados con éxito.'
      })
      
   } catch (error) {
      next (error)
   } finally {
      if (connection) connection.release();
   }
}


module.exports = editAuto