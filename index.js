const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const ejs = require('ejs');
var bodyParser = require('body-parser');
const auth  = require('./controllers/auth-controller');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('login');
  });

app.post('/api/auth', auth);


app.listen(PORT, () => console.log('Server started on port 3000'));

