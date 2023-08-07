


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
const isAdmin = require ('./middlewares/isAdmin')
const getAuto = require ('./controllers/auto/getAuto')
const getListAutos = require ('./controllers/auto/getListAutos')





app.post('/register/usuario', newUser);
app.post('/register/lote', newLote);
app.post('/login', logUser);
app.get('/autos', getListAutos);
app.get('/autos/:idAuto', getAuto);






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
