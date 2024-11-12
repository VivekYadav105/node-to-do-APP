const express = require("express");
const createHttpError = require("http-errors");
const bcrypt = require("bcryptjs");
const userRouter = express.Router();
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");

const {signup,login,forgotPassword} = require('../controllers/userControllers');
const { showError } = require("../helper/error");


userRouter.get("/login", (req, res, next) => {
  try {
    res.render("login.pug",{message:req.flash("message")});
  } catch (err) {
    showError(err,req,res,next)
  }
});

userRouter.get("/signup", async (req, res, next) => {
  try{res.render("signup.pug",{message:req.flash("message")});} 
  catch (err) {
    showError(err,req,res,next)
  }
});

userRouter.get("/forgot", (req, res, next) => {
    try { res.render("forgot.pug",{message:req.flash("message")});}
    catch (err) {showError(err,req,res,next)}
});

userRouter.get("/logout", (req, res, next) => {
  res.clearCookie("user").redirect("/task");
});

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.post("/forgot",forgotPassword)

module.exports = userRouter;
