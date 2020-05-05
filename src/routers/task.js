const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/authentication')
const router = new express.Router()

//GET task?completed=true
//GET task?limit=10&skip=2
//GET task?sortBy=createdBy:desc
//GET task?completed=true&limit=10&skip=2&sortBy=createdBy:desc
router.get('/task', auth, async (req, res) => {
    const match = {}
    const sort = {}
    //console.log(typeof req.query.completed) // lo que le envie por parametro en string 
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
        //console.log(match.completed)
        //console.log(typeof match.completed)
    }

    //GET /task?sortBy=createdAt:desc
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        //console.log(parts)//[ 'createdAt', 'desc' ]
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        //console.log(sort.createdAt)
    }
 
    try {
        //const tareas = await Task.find({ owner:req.user._id})
        //res.status(200).send(tareas)
        //hace lo mismo q el codigo anterior, pero usando populate()
        //await req.user.populate('tasks').execPopulate()

        const user = req.user
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), //paginado
                skip: parseInt(req.query.skip), //salto(a partir de q item empiezo a mostrar)
                sort:sort
                /*
                : { //ordenamientos de los items 1 es asc y -1 desc
                    //completed: 1
                    //createdAt:-1 //por fecha de creacion
                    sort
                } */
            }
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/task/:id', auth, async (req, res) => {
    //console.log(req.params)
    const _id = req.params.id
    try {
        const tarea = await Task.findOne({ _id, owner: req.user._id})
        res.status(200).send(tarea)
    } catch (error) {
        res.status(404).send('no se encuentra la tarea')
    }
})

router.post('/task', auth, async (req, res) => {
    //req.body
    //const tarea = new Task(req.body)
    const tarea = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await tarea.save()
        res.status(201).send(tarea)
    } catch (error) {
        res.status(400).send(error)
    }
}) 

router.patch('/task/:id', auth, async (req, res) => {
    const id = req.params.id
    const updatedData = req.body
    const allowedUptades = ['description', 'completed']
    const updates = Object.keys(updatedData)
    console.log(updates)
    
    const checkKeysAllowed = updates.every(eachElement => allowedUptades.includes(eachElement))
    console.log(checkKeysAllowed)
    if (!checkKeysAllowed) { 
        return res.status(404).send('propiedad invalida') 
    }

    try {
        //va a buscar las tareas, pero va a filtrar por el id de la tarea y ademas por id de usuario.
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task){
            return res.status(400).send()
        }

        updates.forEach(eachKey => task[eachKey] = req.body[eachKey])
        await task.save()
       
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findOneAndDelete({_id: id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router