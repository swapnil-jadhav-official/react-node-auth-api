const jwt = require('jsonwebtoken');
const UserModel = require('../model/userModel');
const bcrypt = require('bcrypt');


const auth = async (req,res) =>{

    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username })
            .then(user => {
                
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, process.env.JWT_SECRET, { expiresIn : "24h"});

                                    res.render('auth', { token });
                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });                                    

                    })
                    .catch(error =>{
                        return res.status(400).send({ error: "Password does not Match"})
                    })
            })
            .catch( error => {
                console.log(error)
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error});
    }

    
};
// const auth = async (req, res) => {
//   req.header('Content-Type', 'application/json');
//   const username = req.body.username;
//   const password = req.body.password;
//   let exist = await UserModel.findOne({ username });
//   if(!exist) return res.status(404).send({ error : "Can't find User!"});
//   console.log("User found");
//   //const user = db.users.find(user => user.username === username && user.password === password);
// //   if (user) {
// //     const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
// //     res.render('auth', { token });
// //   } else {
// //     res.render('error', { error: 'Invalid username or password' });
// //   }

//     res.send("User exist");
// };



module.exports = auth;