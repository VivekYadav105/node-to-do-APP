const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const flash = require('connect-flash')
const cookieParser = require('cookie-parser');
require("dotenv").config();
const createConnection = require("./connection");

const app = express();
const PORT = process.env.PORT || 5000;
const taskRouter = require("./router/taskRoutes");
const userRouter = require("./router/userRoutes")


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(flash())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{maxAge:60000}
}))


const start = async () => {
  try {
    createConnection(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log("connected to the port" + PORT);
    });
  } catch (err) {
    console.log(err);
  }
};

app.use(express.static(path.join(__dirname,'static')))
app.use(morgan("tiny"));
app.use("/task", taskRouter);
app.use("/user",userRouter);

console.log(path.join(__dirname,"static"))
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/",(req,res)=>{
  res.redirect('/task')
  // return res.send("hello world")
})

mongoose
.connect(process.env.MONGO_URL,(err)=>{
  if(err){
    console.log(err)
  }else console.log("connected to the database")
})


app.listen(3000, () => {
  console.log("connected to the port" + 3000);
});

