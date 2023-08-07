const mysql = require ('mysql2/promise');
require ('dotenv').config();

const {MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB, MYSQL_PORT, MYSQL_SPATH} = process.env;

const getDB = async () => {
   let pool;
   try {
      if(!pool){
         pool = mysql.createPool({
            connectionLimit: 50,
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASS,
            database: MYSQL_DB,
            port: MYSQL_PORT,
            socketPath: MYSQL_SPATH,
            timezone: 'Z',
         })
         return await pool.getConnection();
      }  
   } catch (error) {
      console.error(error.message)
   }
};

module.exports = getDB;