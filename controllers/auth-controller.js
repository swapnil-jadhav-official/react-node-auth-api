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
                        if(!passwordCheck) return res.render('error',{error:"Don't have password"});
                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, "secrete", { expiresIn : "24h"});
                                   return res.render('auth', { token, username: user.username, email : user.email });                       
                    })
                    .catch(error =>{
                        return res.render('error',{error:"incorrect password"});
                    })
            })
            .catch( error => {
                return res.render('error',{error: "User not found"});
            })

    } catch (error) {
         return res.render('error',{error:"incorrect password"});
    }

    
};

const register = async (req, res) => {
  try {
    const { username, password, profile, email } = req.body;

    // check the existing user
    const existUsername = UserModel.findOne({ username });
    // check for existing email
    const existEmail = UserModel.findOne({ email });

    Promise.all([existUsername, existEmail])
      .then((results) => {
        const [existingUsername, existingEmail] = results;
        if (existingUsername) {
           return res.render('error',{error:"Please use a unique username"});
        }
        if (existingEmail) {
           return res.render('error',{error:"Please use a unique email"});
        }
        return bcrypt.hash(password, 10);
      })
      .then((hashedPassword) => {
        const user = new UserModel({
          username,
          password: hashedPassword,
          profile: profile || "",
          email,
        });
        return user.save();
      })
      .then(() => {
          return res.render('success');
      })
      .catch((error) => {
        return res.render('error',{error});
      });
  } catch (error) {
     return res.render('error',{error});
  }
};

const resetPassword = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if the user with the provided email exists
    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
      return res.render('error', { error: "User not found for the given email" });
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    // update the user's password
    existingUser.password = hashedPassword;
    await existingUser.save();

    return res.render('success', { message: "Password reset successfully" });
  } catch (error) {
    return res.render('error', { error });
  }
};



module.exports = { auth , register, resetPassword};
