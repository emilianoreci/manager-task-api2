const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/users");
const taskRouter = require("./routers/task");
const app = express();
const port = process.env.PORT;

//permite transformar los datos que viajen en el body de la request a objeto js.
//ej  console.log(req.body.email)
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Escuchando en: " + port);
});

/* test multer

const upload = multer({
    dest: 'images'//crea una carpeta con tal nombre para almacenar los archivos subidos.
})

upload.single('upload') lo que le paso como argumento, es la key que va usar en el 
form data para enviar el archivo.
app.post('/upload', upload.single('upload'), (req, res) => {
    res.send('he')
}) 
*/

//const Task = require('./models/task')
//const User = require('./models/user')
//Obtener los datos de un usuario a partir de la tarea
//const main = async () => {
//    const task = await Task.findById('5eaad2110a1fab24229fa573')
//    await task.populate('owner').execPopulate()
//    console.log(task.owner)
//}
//main()

//Obtener los datos de una tarea a partir de un usario usando populate
//const main = async () => {
//    const user = await User.findById('5eaad10e0b939021c05571de')
//    await user.populate('tasks').execPopulate()
//    console.log(user.tasks)
//}
//main()

/**************
 * MIDDLEWARE *
 **************/
/* app.use( (req, res, next) => {
    if (req.method === "GET") {
        res.send('servicio no disponible')
    }else {
        next()
    }
})

app.use((req, res, next) => {
    res.status(503).send('servicio no disponible, intentelo mas tarde!')
})
*/
//test..
/* 
const jwt = require('jsonwebtoken')

const myFunction = async () => {
   const token = jwt.sign({_id: 'abc123'},'mySecretOrPublicKey', { expiresIn: '7 days'})
   console.log(token)

   const data = jwt.verify(token, 'mySecretOrPublicKey')
   console.log(data)
   
}

myFunction() 
*/
