const jwt = require('jsonwebtoken');
const UserModel = require('../model/userModel');
const bcrypt = require('bcrypt');

const auth = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.render('error', { error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.render('error', { error: "Incorrect password" });
    }

    const token = jwt.sign({
      userId: user._id,
      username: user.username
    }, "secrete", { expiresIn: "24h" });

    return res.render('auth', { token, username: user.username, email: user.email });
  } catch (error) {
    return res.render('error', { error: "Error during authentication" });
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
          return res.render('success',{ message: "User created successfully" });
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

    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
      return res.render('error', { error: "User not found for the given username" });
    }


    const hashedPassword = await bcrypt.hash(password[0], 10);

    existingUser.password = hashedPassword;
    await existingUser.save();

    return res.render('success', { message: "Password reset successfully" });
  } catch (error) {
    return res.render('error', { error: "Error during password reset" });
  }
};


module.exports = { auth , register, resetPassword};
