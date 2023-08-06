const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require('cookie-parser');
require("dotenv").config();
const createConnection = require("./connection");

const app = express();
const PORT = process.env.PORT || 5000;
const taskRouter = require("./router/taskRoutes");
const userRouter = require("./router/userRoutes")


app.use(express.json)
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())


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
app.set("view_engine", "pug");

app.get("/",(req,res)=>{
  res.redirect('/task')
})

//function to start the app
start();
