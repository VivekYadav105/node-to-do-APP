const express = require("express");
const { verifyUser } = require("../middelwares/authMiddleware");
const {
  getTasks,
  addTasks,
  updateTask,
  deleteTask,
  editTask,
  getEditForm,
  view,
} = require("../controllers/taskControllers");

const taskRouter = express.Router();

taskRouter.get("/", getTasks);
taskRouter.post("/add", verifyUser, addTasks);
taskRouter.post("/update/:id", verifyUser, updateTask);
taskRouter.post("/delete/:id", verifyUser, deleteTask);
taskRouter.get("/edit/:id", verifyUser, getEditForm);
taskRouter.post("/edit/:id", verifyUser, editTask);
taskRouter.get("/view/:type", verifyUser, view);

module.exports = taskRouter;
