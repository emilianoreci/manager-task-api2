/* 
const mongodb = require('mongodb') //driver 
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
*/




/**********************************
 * USANDO LA API DEFAULT DE MONGO *
 **********************************/

/* 
const {MongoClient, ObjectID} = require('mongodb') //usando destructuring 
const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionUrl, {useNewUrlParser:true}, (error, client) => {
    if (error) console.log(error) 
    
    //console.log('**** -- Conectado Correctamente -- ****')

    const db = client.db(databaseName)



})
*/


/***********
 * PROMISE *
 ***********/

 /* 
    db.collection('users')
        //metodo updateOne devuelve una promesa
        .updateOne({
            _id: new ObjectID('5e976659fa5bb1318fe5e390') //filtro de busqueda
        }, {
            $set: {
                name: 'Mike'    //dato a actualizar
            }
        })
        .then(result => console.log(result))
        .catch(error => console.log(error))

    db.collection('task')
        .updateMany({completed: false}, {
            $set:{
                completed: true
            }
        })
        .then(result => console.log(result))
        .catch(error => console.log(error))

    //delete: deleteOne & deleteMany
    db.collection('task')
        .deleteOne({_id: new ObjectID('5e976b490e56b13a7cc83016')})
        .then(result => console.log(result.deletedCount))
        .catch(error => console.log(error))
*/









/********************
 * USANDO CALLBACKS *
 ********************/
/*
    db.collection('task').findOne({
        _id: new ObjectID('5e976b490e56b13a7cc83016')
    }, (error, task) => {
        if (error) console.log(error)
        console.log(task)
    })

    db.collection('task').find({completed:false}).toArray(
        (error, tasks) => {
            if (error) console.log(error)
            console.log(tasks)
        }
    )

    //find()
    db.collection('users').find({age:27}).toArray(
        (error, user) => {
            if (error) console.log(error)
            console.log(user)
        }
    )
        
    //count
    db.collection('users').find({age:27}).count(
        (error, count) => {
            if (error) console.log(error)
            console.log(count)
        }
    )
 
    //findOne devuelve la primer coincidencia.
    db.collection('users').findOne({name:'sofia'}, (error, user) => {
        //si a findOne le pasamos un objeto q no esta en la bd, devuelve null, no arroja error!
        if (error) console.log(error)
        console.log(user)
    })
    //buscar por id
    db.collection('users').findOne({_id: new ObjectID('5e975c18bc100e23e4e96874')}, (error, user) => {
        if (error) console.log(error)
        console.log(user)
    })
 
    db.collection('users').insertOne({
        name :'andrew',
        age:27
    }, (error, result) => {
        if (error) console.log('no se puede insertar un usuario')
        console.log(result.ops)
    })

    db.collection('users').insertMany([
        {name: 'jenn', age:22},
        {name: 'sofia', age:21}
    ], (error, result) => {
        if (error) console.log('no se puede insertar usuarios')
        console.log(result.ops)
    })
 
    db.collection('task').insertMany([
        {
            description: 'buy food', 
            completed: true
        },{
            description: 'learn node', 
            completed: false
        },{
            description: 'watch tv', 
            completed: true
        }
    ], (error, result) => {
        if (error) console.log(error)
        console.log(result.ops)
    })
 */