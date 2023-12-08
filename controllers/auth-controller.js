const jwt = require('jsonwebtoken');
const db = require("../db/db.json");
const UserModel = require('../model/userModel');
const auth = async (req, res) => {
  req.header('Content-Type', 'application/json');
  const username = req.body.username;
  const password = req.body.password;
  let exist = await UserModel.findOne({ username });
  if(!exist) return res.status(404).send({ error : "Can't find User!"});
  console.log("User found");
  //const user = db.users.find(user => user.username === username && user.password === password);
//   if (user) {
//     const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
//     res.render('auth', { token });
//   } else {
//     res.render('error', { error: 'Invalid username or password' });
//   }

    res.send("User exist");
};



module.exports = auth;