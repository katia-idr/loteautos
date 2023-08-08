


const express = require('express');
const path = require ('path');
const app = express();
const PORT  = process.env.PORT || 4000;

app.use(express.json());


app.get('/', function (req, res){
   res.sendFile(path.join(__dirname, '/public/'))
})


const publicPath = path.join(__dirname, 'public');


app.use(express.static(publicPath));


const newUser = require ('./controllers/user/newUser')
const newLote = require ('./controllers/admin/newLote')
const logUser = require ('./controllers/user/logUser')
const profileUser = require ('./controllers/user/profileUser')
const newAuto = require ('./controllers/auto/newAuto');
const deleteUser = require('./controllers/admin/deleteUser');
const editUser = require ('./controllers/user/editUser');
const editUserPass = require('./controllers/user/editUserPass');
const tokenMatches = require ('./middlewares/tokenMatches')


app.post('/register/auto', newAuto);
app.post('/register/usuario', newUser);
app.post('/register/lote', newLote);
app.post('/login', logUser);
app.get('/user/:idUser', profileUser);

//delete user
app.delete('/user/delete', deleteUser)

//editar usuario
app.put('/user/:idUser/edit', editUser);

//cambiar pass usuario
app.put('/user/:idUser/newpass', tokenMatches, editUserPass)


//un auto
//autos 1 concesionaria
//todos los autos






app.use((error, req, res, _) => {
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
