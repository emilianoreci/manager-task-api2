const mongoose = require('mongoose')

//Schema Task
const taskSchema = new mongoose.Schema({
    description: { 
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'//permite asociar/relacionar Schema/model "User" al schema task.
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task