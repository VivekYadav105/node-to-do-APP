const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    name:{type:String,required:true},
    isCompleted:{type:Boolean,default:false},
    userid:{type:mongoose.SchemaTypes.ObjectId,required:true}
})

const TaskModel = mongoose.model('task',taskSchema)

module.exports = TaskModel