
const express = require('express');
const path = require ('path');
const app = express();
const cors = require ("cors");
const PORT  = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const fileUpload = require('express-fileupload');

app.get('/', function (req, res){
   res.sendFile(path.join(__dirname, '/public/'))
})

const publicPath = path.join(__dirname, 'public');


app.use(express.static(publicPath));


//controladores
const newUser = require ('./controllers/user/newUser');
const newLote = require ('./controllers/admin/newLote');
const logUser = require ('./controllers/user/logUser');
const profileUser = require ('./controllers/user/profileUser');
const newAuto = require ('./controllers/auto/newAuto');
const deleteUser = require('./controllers/admin/deleteUser');
const editUser = require ('./controllers/user/editUser');
const editUserPass = require('./controllers/user/editUserPass');
const tokenMatches = require ('./middlewares/tokenMatches');
const isAdmin = require ('./middlewares/isAdmin');
const newAdmin = require('./controllers/admin/newAdmin');
const isLogged = require('./middlewares/isLogged');
const newAutoPhoto = require('./controllers/auto/newAutoPhoto');
const getAuto = require('./controllers/auto/getAuto');
const getListAutos = require ('./controllers/auto/getListAutos');
const editAuto = require('./controllers/auto/editAuto');


//endpoints admin
//para crear lotes / frontend:check
app.post('/register/lote', isLogged, isAdmin, newLote);

//delete user
app.delete('/user/delete', isLogged, isAdmin, deleteUser);

//para crear nuevo admin / frontend:check
app.post('/register/admin', newAdmin);


//endpoints user
//new user / frontend:check
app.post('/register/user', newUser);

//login / frontend:check
app.post('/login', logUser);

//user profile 
app.get('/user/:idUser', isLogged, profileUser);

//editar usuario /frontend:check
app.put('/user/:idUser/edit', isLogged, tokenMatches, editUser);

//cambiar pass usuario / frontend:Check
app.put('/user/:idUser/newpass', isLogged, tokenMatches, editUserPass);



//endpoints autos
//registrar auto / frontend:check
app.post('/register/auto', isLogged, newAuto);

//añadir foto
app.put('/register/auto/:idAuto/photo', isLogged, fileUpload({ debug: true }), newAutoPhoto)

//un auto
app.get ('/auto/:idAuto', isLogged, getAuto);

//todos los autos
app.get ('/autos/todos', isLogged, getListAutos);

//editar auto 
app.put('/auto/:idAuto/edit', isLogged, tokenMatches, editAuto);






app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.httpStatus || 500);
    res.send({
        status: 'Error',
        message: error.message,
    });
});


app.use((req, res) => {
    res.status(404).send({
        status: 'Error',
        message: 'Not found',
    });
});


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
