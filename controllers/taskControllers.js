const TaskModel = require("../models/task");
const createError = require("http-errors");
const { isValidObjectId } = require("mongoose");
const devTasks = require("../static/devTasks");
const jwt = require("jsonwebtoken");

const getTasks = async (req, res, next) => {
  try {
    if (!req) {
      throw new createError(500, "something went wrong try again later");
    }
    var tasks =''
    if(req.cookies.user){ tasks = await TaskModel.find({userid:req.cookies.user.id});}
    else{tasks = devTasks}
    res.render("home.pug", { tasks: tasks, type: "all",user:req.cookies.user});
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

const addTasks = async (req, res, next) => {
  const data = await req.body;
  const taskName = await req.body.taskName
  try {
    if(!taskName){throw new createError(400,"enter task name")}
    const task = await TaskModel.create({ name: req.body.taskName,userid:req.cookies.user.id });
    res.redirect("/task")
      .status(200)
      .json({ task: data, success: true, message: "added successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      task: false,
      message: "adding to db failed",
      reason: err.message,
      status:err.status
    }).redirect("/task")
  }
};

const updateTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const value = await req.body.complete;
    if (!id) throw new createError(400, `id is not recieved`);
    if (!isValidObjectId(id)) {
      throw new createError(400, `given id is not valid`);
    }
    const task = await TaskModel.find({ _id: id });
    if (!task.length)
      throw new createError(404, `task with id:${id} is not found`);
    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      { $set: { isCompleted: value } },
      { new: true }
    );
    if (updatedTask) {
      res.redirect("/task")
      // .status(200).json({
      //   message: "task updated succesfully",
      //   "update task": updatedTask,
      //   success: true,
      // });
    }
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message, status: err.status || 500 });
  }
};

const editTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const taskName = await req.body.taskName;
    const value = await req.body.status;
    if (!id) throw new createError(400, `id is not recieved`);
    if (!isValidObjectId(id)) {
      throw new createError(400, `given id is not valid`);
    }
    const task = await TaskModel.find({ _id: id });
    if (!task.length)
      throw new createError(404, `task with id:${id} is not found`);
    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      { $set: { name: taskName,isCompleted:value?true:false } },
      { new: true }
    );
    if (updatedTask)
       res.redirect("/task")
      //.status(200).json({
      //   message: "task updated succesfully",
      //   "update task": updatedTask,
      //   success: true,
      // });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message, status: err.status || 500 });
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) throw new createError(400, `id is not recieved`);
    if (!isValidObjectId(id)) {
      throw new createError(400, `given id is not valid`);
    }
    const task = await TaskModel.find({ _id: id });
    if (!task.length)
      throw new createError(404, `task with id:${id} is not found`);
    const updatedTask = await TaskModel.findByIdAndRemove(id, { new: true });
    if (updatedTask) {
      res.redirect("/task")
      // .status(200).json({
      //   message: "task removed succesfully",
      //   "removed task": updatedTask,
      //   success: true,
      // });
    }
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message, status: err.status || 500 });
  }
};

async function getEditForm(req, res, next) {
  try {
    const id = req.params.id;
    if (!id) throw new createError(400, `id is not recieved`);
    if (!isValidObjectId(id)) {
      throw new createError(400, `given id is not valid`);
    }
    const tasks = await TaskModel.find({ _id: id });
    if (!tasks.length)
      throw new createError(404, `task with id:${id} is not found`);
    res.render("edit.pug", { tasks: tasks,user:req.cookies.user });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message, status: err.status || 500 });
    console.log(err);
  }
}

async function view(req, res, next) {
  try {
    if (!req) {
      throw new createError(500, "something went wrong");
    }
    var query = {};
    const type = await req.params.type;
    console.log(type);
      query = type=="completed"? { isCompleted: true,userid:req.cookies.user.id }:{ userid:req.cookies.user.id,isCompleted: false };
    const tasks = await TaskModel.find(query);
    res.render("home.pug",{ tasks: tasks, type: type,user:req.cookies.user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

module.exports = {
  addTasks,
  deleteTask,
  editTask,
  updateTask,
  getEditForm,
  view,
  getTasks
};
