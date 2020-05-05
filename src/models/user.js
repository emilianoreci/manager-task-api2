const mongoose = require('mongoose')
const validator = require('validator')
const bcript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

/*****************
 * USANDO SCHEMA *
 *****************/
//te permite usar opciones como midlewares de mongoose(save, validate, remove, deleteOne, pre, post ...)

const userSchema = new mongoose.Schema({
    name : { 
        type: String,
        trim: true  //le quita los espacios en blanco.
    },
    age : { 
        type: Number, //Scehma type mongoose
        default: 1, //por defecto tiene 1 si no se le pasa una edad.
        //propiedad validate de mongoose, permite aplicarle una validacion al campo
        validate(value){
            if (value < 18) throw new Error("debe ser mayor de 18")
        }
    },
    email : {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) throw new Error ('email invalido')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength:7,
        validate (value) {
            //if (value.length < 7) throw new Error('debe tener mas de 6 caracteres el pass')
            if (value.toLowerCase().includes('password')) throw new Error('el pass no puede ser password')
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    avatar: {
        type: Buffer//almacena files en binarios
    }
}, {
    timestamps: true //opcional, muestra datos x ej la fecha de creacion de un usuario.
})

//no almacena datos de tareas en usuario, sino que crea una relacion "virtual" entre ambos.
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', //local--> usuario
    foreignField: 'owner' //externa-->tarea "clave foranea"
})

//Quitar propiedades a un modelo para enviarlo como respuesta al cliente.
//Al objeto user le quito el pass, el array de token y el avatar, para convertirlo
// a json para enviarlo como respuesta.
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//generar token de autenticacion en el login
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token: token})
    await user.save()
    return token
}

//creando metodo findByCredentials
userSchema.statics.findByCredentials = async (email, pass) => { 
    const user = await User.findOne({email: email})

    if (!user ) {
        throw new Error('No se puede loguear')
    }

    const isMatch = await bcript.compare(pass, user.password)

    if (!isMatch) {
        throw new Error('No se puede loguear...')
    }

    return user
}

//hasheando el pass sin formato.
//usando el middleware pre() -se ejecuta antes de "save" tanto parca cuando se crea o modifica un usuario
userSchema.pre('save', async function (next) {
    //hace referecia al documento
    const user = this 
    //console.log('desde el middleware... antes de save')
    
    if (user.isModified('password')) {
        user.password = await bcript.hash(user.password, 8)
    }

    //para terminar el middleware y pasar a lo siguiente
    next()
})

//Antes de borrar un usuario, elimina primero todas las tareas de ese usuario.
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User


/**************************************
 * DIFERENCIA ENTRE METHODS Y STATICS *
 **************************************/
//methods es para cada instancia, mientras que statics es para todos



/***************************
 * FORMA BASICA SIN SCHEMA *
 ***************************/
/* 

const User = mongoose.model('User', {
    name : { 
        type: String,
        trim: true  //le quita los espacios en blanco.
    },
    age : { 
        type: Number, //Scehma type mongoose
        default: 1, //por defecto tiene 1 si no se le pasa una edad.
        //propiedad validate de mongoose, permite aplicarle una validacion al campo
        validate(value){
            if (value < 18) throw new Error('debe ser mayor de 18')
        }
    },
    email : {
        type: String,
        required: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) throw new Error ('email invalido')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength:7,
        validate (value) {
            //if (value.length < 7) throw new Error('debe tener mas de 6 caracteres el pass')
            if (value.toLowerCase().includes('password')) throw new Error('el pass no puede ser password')
        }
    }
})

module.exports = User 
*/