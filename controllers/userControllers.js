const {CustomError,showError} = require('../helper/error')
const userModel = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const signup = async (req, res, next) => {
  try {
    const { fname, lname, email, password, confirmPassword } = await req.body;
    if (password !== confirmPassword) {
      throw new CustomError(400, "password doesn't match", {
        redirect: "/user/signup",
        status: 400,
      });
    }
    const user = await userModel.find({ email: email });
    if (user.length) {
      throw new CustomError(409, "user already exists in the database", {
        redirect: "/user/signup",
        status:409
      });
    }
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const user2 = await userModel.create(
      {
        fname: fname,
        lname: lname,
        email: email,
        password: encryptedPassword,
      },
      { new: true }
    );
    res.redirect("/user/login")
      // .status(200)
      // .json({ msg: "user created succesfully", success: true, user: user2 });
  } catch (err) {
    showError(err,req,res,next)}
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new CustomError(404, "user with given mail is not found", {
        user: false,
        redirect: "/user/login",
        status: 404,
      });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (comparePassword) {
      const userToken = await jwt.sign({ email: user.email }, "secretValue");
      res
        .cookie("user",  {userToken,id:user.id} )
        .status(200)
        .redirect("/task");
    } else {
      throw new CustomError(400, "password did not match", {
        user: false,
        redirect: "/user/login",
        success: false,
      });
    }
  } catch (err) {
    showError(err,req,res,next)
    // res
    //   .redirect(err.route)
    //   .status(err.status || 500)
    //   .json({ message: err.message, success: false, user: false });
  }
};

const forgotPassword = async (req,res,next)=>{
    const {email} = req.body
    const user = await userModel.findOne({email:email})
    if(!user){throw new CustomError(404,"user with give email is not found")}
    res.send(`congrats ${user.fname+" "+user.lname} lost password !!`)  
}

module.exports = { signup, login,forgotPassword };
