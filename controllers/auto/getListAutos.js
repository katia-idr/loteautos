const getDB = require("../../database/getDB");


const getListAutos = async (req,res, next) => {
   let connection;

   try {
      connection = await getDB();

      const { search, order, direction } = req.query;
      const validOrderOptions = ['marca', 'año','tipo','color','kilometraje','precioventa', 'creation_time'];
      const validDirectionOptions = ['DESC', 'ASC'];
      const orderBy = validOrderOptions.includes(order) ? order : 'creation_time';
      const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'DESC';
      
      let data = [];
      let autos;

      const idReqUser = req.userAuth.id;
      const loteUserReq = req.loteId; 
      

        const [users] = await connection.query (`
        select tipo from user where id =?`,
        [idReqUser]);

        if (users[0].tipo === 'admin'){
         if (search) {
            [autos] = await connection.query(
                `SELECT * FROM auto WHERE marca or año or color or kilometraje or precioventa  like ? ORDER BY ${orderBy} ${orderDirection}`,
                [`%${search}%`]
            );
        } else {
            [autos] = await connection.query(
                `SELECT * FROM auto ORDER BY ${orderBy} ${orderDirection}`
            );
        }
        }


        if (users[0].tipo === 'user') {
         if (search) {
            [autos] = await connection.query(
                `SELECT * FROM auto WHERE idLote = ${loteUserReq} and WHERE marca or año or color or kilometraje or precioventa  like ? ORDER BY ${orderBy} ${orderDirection}`,
                [`%${search}%`]
            );
        } else {
            [autos] = await connection.query(
                `SELECT * FROM auto WHERE idLote = ${loteUserReq} ORDER BY ${orderBy} ${orderDirection}`
            );
        }
        }
        

        for (let i = 0; i < autos.length; i++) {
         const [photos] = await connection.query(
             `SELECT name FROM auto_photo WHERE idAuto = ?`,
             [autos[i].id]
         );

         data.push({
             ...autos[i],
             photos,
         });
     }

     res.send({
         status: 'OK',
         data,
     });

      
   } catch (error) {
      next (error)
   } finally {
      if (connection) connection.release();
   }
}


module.exports = getListAutos