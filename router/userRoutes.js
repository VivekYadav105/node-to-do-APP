const express = require("express");
const createHttpError = require("http-errors");
const bcrypt = require("bcryptjs");
const userRouter = express.Router();
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");

const {signup,login,forgotPassword} = require('../controllers/userControllers')


userRouter.get("/login", (req, res, next) => {
  try {
    res.render("login.pug");
  } catch (err) {
    res.status(500).json({ msg: err.message, error: "internal server error" });
  }
});

userRouter.get("/signup", async (req, res, next) => {
  try{res.render("signup.pug");} 
  catch (err) {res.status(500).json({ msg: err.message, error: "internal server error" })}
});

userRouter.get("/forgot", (req, res, next) => {
    try { res.render("forgot.pug")}
    catch (err) {res.status(500).json({ msg: err.message, error: "internal server error" })}
});

userRouter.get("/logout", (req, res, next) => {
  res.clearCookie("user").redirect("/task");
});

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.post("/forgot",forgotPassword)

module.exports = userRouter;
