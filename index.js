const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const corsMiddleware = require('./config/cors');
app.use(express.json());

const login = require('./routes/login')
const register = require('./routes/register')
const newDepo = require('./routes/depo/newDepo')
const topup = require('./routes/depo/topUp')
const edit_depo = require('./routes/depo/editDepo')
const userRoutes = require('./routes/user/userRoutes')
const belanja = require('./routes/belanja/belanja')
const pengeluaran = require('./routes/pengeluaran/pengeluaran')
const saldo = require('./routes/saldo/saldo')
const catatan = require('./routes/catatan/catatan')
//cors middleware
app.use(corsMiddleware);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Endpoint login
app.use('/login', login)
//Endpoint register
app.use('/register', register)

app.use('/user', newDepo);
app.use('/user', userRoutes);
app.use('/user', belanja);
app.use('/user', pengeluaran);
app.use('/user', saldo);
app.use('/user', catatan);
app.use('/user', topup);
app.use('/user', edit_depo);

// Jalankan server
app.listen(5000, () => {
  console.log('Server berjalan pada http://localhost:5000');
});

