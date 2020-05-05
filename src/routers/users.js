const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/authentication");
const multer = require("multer");
const sharp = require("sharp");
const {
  sendWelcomeEmail,
  sendClosedAccountEmail,
} = require("../emails/account");
/*
 ** Router te permite tener los endpoints en distintos archivos, en vez de tenerlos
 ** todos juntos en el index.js
 */
const router = new express.Router();

//rutas para probar
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(202).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/users", async (req, res) => {
  console.log(req.body);

  const usuario = new User(req.body);
  try {
    await usuario.save();
    sendWelcomeEmail(usuario.email, usuario.name);
    const token = await usuario.generateAuthToken();
    res.send({ usuario, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const email = req.body.email;
    const pass = req.body.password;
    //findByCredentials: metodo creado, no está en mongoose, esta creada en el model/users
    const user = await User.findByCredentials(email, pass);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//cerrar la session actual ej la sesion del mobile
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//cerrar todas las sesiones
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//Modificar perfil de usuario
router.patch("/users/me", auth, async (req, res) => {
  //const id = req.params.id
  const allowedUptades = ["name", "email", "age", "password"];
  const updates = Object.keys(req.body); //[ 'namesa', 'age' ]

  const isValidOperation = updates.every((eachElement) => {
    return allowedUptades.includes(eachElement);
  });
  //console.log(isValidOperation)

  if (isValidOperation === false) {
    return res.status(400).send({ error: "invalid update" });
  }

  try {
    const user = req.user;
    updates.forEach((eachKey) => (user[eachKey] = req.body[eachKey]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//eliminar usuario
router.delete("/users/me", auth, async (req, res) => {
  //console.log(req.params.id) lo que paso por url
  try {
    await req.user.remove();
    sendClosedAccountEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send({ error: "error en el servidor" });
  }
});

//config multer
const upload = multer({
  //dest: 'avatars', en vez de guardarlo en una carpeta, al no especificar puedo guardarlo en bd
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("El avatar deber ser jpg, jpeg o png"));
    }
    cb(undefined, true);
  },
});

//cargar avatar de usuario tanto como 1 vez como para cambiarla.
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    //tomo la img en binario y se lo paso a sharp para cambiarle el tamaño y la extension.
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    //ingreso el file en binario modificando el tamaño etc a la propiedad avatar de usuario.
    // para despues guardarlo en bd.
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//eliminar avatar de usuario
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send({ error: "error en el servidor" });
  }
});

//visualizar avatar
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    //seteo el header
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;

/* 
router.get('/users/:id', async (req, res) => {
    //accedo a los paramas que se manda en la url con get.
    console.log(req.params)
    const _id = req.params.id
    try {
        const usuario = await User.findById(_id)
        if (!usuario) {
            return res.status(404).send()
        }
        res.status(200).send(usuario)
    } catch (error) {
        res.status(500).send('no se ha encontrado un usuario')
    }
})
*/

/* 

app.patch('/users/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    //const keysFromObject = Object.keys(req.body) // ['name', 'age']
    //console.log(req.body)
    //console.log(keysFromObject)

    //validacion opcional para arrojar un status code, en caso que se en envie en el body una propiedad
    //para modificar el usuario no tenga,ej altura.
    //es opcional ya que si no hay dicha propieda mongoose lo va a ignorar, pero envia un status code 200
    const keysFromObject = Object.keys(req.body) // ['name', 'age']
    const allowedUptades = ['name', 'email', 'age', 'password']
    const isValidOperation = keysFromObject.every(eachElement => {
        allowedUptades.includes(eachElement)
    })

    if (!isValidOperation) {
        res.status(400).send({error: 'no se puede actualizar esa propiedad, no esta diponible'})
    }

    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true})
    
        if (!user) {
            return res.status(400).send({error:'no exite usuario'})
        }  
        
        res.send(user)
    } catch (error) {
        res.status(400).send({error: 'no se ha localizado el recurso'})
    }
}) */
