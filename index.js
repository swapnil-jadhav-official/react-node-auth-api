const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const ejs = require('ejs');
var bodyParser = require('body-parser');
const {auth, register, resetPassword}  = require('./controllers/auth-controller');
const Connection = require('./db/db');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
Connection();
app.get('/', (req, res) => {
    res.render('login');
  });
app.get('/reset', (req, res) => {
    const username = req.query.username || '';
    res.render('reset', { username });
  });
app.post('/reset-password', resetPassword);

app.get('/new-user', (req, res) => {
    res.render('register');
  });
  
app.post('/register',register)

app.post('/api/auth', auth);


app.listen(PORT, () => console.log('Server started on port 3000'));

