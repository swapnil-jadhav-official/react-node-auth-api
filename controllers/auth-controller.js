const jwt = require('jsonwebtoken');
const db = require("../db/db.json");

const auth = (req, res) => {
  req.header('Content-Type', 'application/json');
  const username = req.body.username;
  const password = req.body.password;
  const user = db.users.find(user => user.username === username && user.password === password);
  if (user) {
    const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
    res.render('auth', { token });
  } else {
    res.render('error', { error: 'Invalid username or password' });
  }
};

module.exports = auth;