const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const db = require("./db.json");
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.post('/api/auth', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  const user = db.users.find(user => user.username === username && user.password === password);

  if (user) {
    const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

app.listen(PORT, () => console.log('Server started on port 3000'));

