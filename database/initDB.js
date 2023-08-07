const getDB = require("./getDB");



async function main() {
   let connection;

   try {
      connection = await getDB();
     
      console.log('Connection with database ok');

      await connection.query('drop table if exists user');
      await connection.query('drop table if exists auto_photo');
      await connection.query('drop table if exists auto');
      await connection.query('drop table if exists lote_photo');
      await connection.query('drop table if exists lote');
   

      console.log('Tables eliminated')

      await connection.query (`create table if not exists lote (
         id int unsigned primary key auto_increment,
         nombre varchar(80),
         razonsocial varchar(50),
         direccion varchar(250),
         telefono varchar (50),
         createdAt DATETIME
      )`);
      

      await connection.query (`
            CREATE TABLE IF NOT EXISTS lote_photo (
            id INT UNSIGNED PRIMARY KEY auto_increment,
            name VARCHAR(255) NOT NULL,
            idLote INT UNSIGNED NOT NULL,
            FOREIGN KEY (idLote) REFERENCES lote (id)
            )`);

      await connection.query (`create table if not exists auto(
         id INT UNSIGNED PRIMARY KEY auto_increment,
            placa varchar(30),
            vin varchar(50),
            año varchar(10),
            version varchar(100),
            tipo ENUM ('suv','compacto','monovolumen','otro') DEFAULT 'compacto',
            color varchar(80),
            puertas tinyint unsigned,
            dobletraccion bool,
            kilometraje int unsigned,
            adquisicion enum ('compra','consigna') default 'compra',
            entidadplaca varchar(80),
            fechaadqui date,
            preciocompra int unsigned,
            precioventa int unsigned,
            comentarios text,
            createdAt DATETIME,
            idLote INT UNSIGNED,
            FOREIGN KEY (idLote) REFERENCES lote (id)
      ) `);


      await connection.query (`
            CREATE TABLE IF NOT EXISTS auto_photo (
            id INT UNSIGNED PRIMARY KEY auto_increment,
            name VARCHAR(255),
            idAuto INT UNSIGNED NOT NULL,
            FOREIGN KEY (idAuto) REFERENCES auto (id)
            )`);

      
      await connection.query (`create table if not exists user(
         id int unsigned PRIMARY KEY auto_increment,
         nombre VARCHAR(50) not null,
         apellido1 VARCHAR(50) not null,
         apellido2 VARCHAR(50),
         email VARCHAR(100) not null,
         password VARCHAR(255) not null,
         tipo ENUM('admin', 'normal') DEFAULT 'normal',
         createdAt DATETIME,
         idLote INT UNSIGNED,
         FOREIGN KEY (idLote) REFERENCES lote (id)
         
         
            ) `);

         console.log('Tables created');





   } catch (error) {
      console.error(error.message);
      
   } finally {
      if (connection) connection.release();
      process.exit();
   }
}

main();