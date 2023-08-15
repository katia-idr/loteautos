const getDB = require("../database/getDB");
const { showError } = require("../helpers");
const jwt = require ('jsonwebtoken')

const isLogged = async (req, res, next) => {
   let connection;
   try { 
      connection = await getDB()
      const {authorization} = req.headers;
      if (!authorization) {
         throw showError ('¡Ups! Falta la autorización correspondiente.',401)
      }

      let tokenInfo;
      try {
         tokenInfo = jwt.verify(authorization, process.env.SECRET)
      } catch (error) {
         throw showError ('¡Ups! No has iniciado sesión.', 401)
      }

      const [user] = await connection.query (
         `select * from user where id = ?`,
         [tokenInfo.id] 
      )

      if (user.length < 1) {
         throw showError ('El token no es válido.',401)
      }

      req.userAuth = tokenInfo;
      req.loteId = user[0].idLote

    

      next()

   } catch (error) {
      next (error) 
   } finally {
   if (connection) connection.release
   }
}
module.exports = isLogged