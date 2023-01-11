const { Router } = require("express");
const UserLoginController = require("../controllers/UserLoginController");
const UserController = require("../controllers/UserController");
const { AUTH0_TENANT_ID, AUTH0_CLIENT_ID } = process.env;
const {
  uploadImage,
  uploadMulter,
} = require("../controllers/cloudinaryController");
const fs = require("fs-extra");
const { jwtCheck } = require("../auth");
const { DuplicatedRecord } = require("../errors");

const router = Router();

// ESTE ES UN TEST PARA PROBAR LA IDTOKEN ENVIADA A TRAVES DEL
// HEADER AUTHORIZATION DESDE EL FRONT
// SE UTILIZA EL MIDDLEWARE jwtCheck QUE DECODIFICA LA JWT TOKEN
// Y AGREGA EL OBJETO auth A REQ
router.get("/test", jwtCheck, async (req, res, next) => {
  // SI NO TIENE AUTHORIZATION HEADER O LA IDTOKEN NO ES VALIDA
  // NO LLEGA ACA, DIRECTAMENTE MANDA EL ERROR EL MIDDLEWARE

  // SI ESTAMOS ACA ES PORQUE MANDO UNA TOKEN VALIDA
  // LA MANDAMOS CON STATUS 200
  res.status(200).json(req.auth);
});

// POST /users/login
router.post("/login", async (req, res, next) => {
  const { event } = req.body;

  // console.log(event);

  // Chequeamos que la request sea fidedigna con TENANT y CLIENT
  // Y contenga user
  if (
    event?.tenant?.id !== AUTH0_TENANT_ID ||
    event?.client?.client_id !== AUTH0_CLIENT_ID ||
    !event.user
  )
    return res.status(401).send();

  // Chequeamos que la request tenga user y user_id
  const { user_id, email } = event.user;
  if (!user_id || !email) return res.status(400).send();

  let [loginStrategy, loginId] = user_id.split("|");

  if (loginStrategy !== "auth0") {
    // No inicio sesion a traves de la BD nuestra,
    // deberemos buscar el userId en UserLogins

    // BUSCAMOS USER_ID en UserLogins
    try {
      loginId = await UserLoginController.find(user_id);
    } catch (error) {
      console.error("POST /users/login UserLoginController.find error");
      return next(error);
    }
  }

  if (!loginId) {
    // No se encontro userLogin, veamos si existe el e-mail
    try {
      let user = await UserController.findByEmail(email);

      // No existe el usuario
      // Crear User
      if (!user) user = await UserController.add(event.user);

      loginId = user.id;

      // Debemos crear un nuevo UserLogin
      await UserLoginController.add({
        UserId: loginId,
        oauth_id: user_id,
      });
    } catch (error) {
      console.error(
        "POST /users/login UserController.findByEmail/add or UserLoginController.add error"
      );
      return next(error);
    }
  }

  // Actualizamos datos personales segun perfil
  try {
    const user = await UserController.update(loginId, event.user);
  } catch (error) {
    // existe el usuario, pero el user_login pertenece a otro
    // esto pasaria si hay coinciden event.user.user_id (me di cuenta haciendo testing en postman)
    if (error instanceof DuplicatedRecord)
      return res
        .status(400)
        .json({ error: "OAuth string provided belongs to another user" });

    console.error("POST /users/login UserController.update error");
    return next(error);
  }

  // Devolvemos la info a Auth0
  try {
    const user_role = await UserController.getUserRole(loginId);

    return res.status(201).json({ id: loginId, user_role });
  } catch (error) {
    console.error("POST /users/login UserController.getUserRole error");
    next(error);
  }
});

// POST /users/:id/updateImage
router.post(
  "/:id/updateImage",
  uploadMulter("./public/ProfileImages").single("image"), // middleware para procesar la carga de archivos
  async (req, res, next) => {
    const { id } = req.params;

    // no hay archivo cargado, mandamos un bad request
    if (!req.file) return res.status(400).json({ error: "No picture" });
    if (!id) return res.status(400).send();

    const editUser = {};

    try {
      // cargamos archivo a cloudinary
      const result = await uploadImage(req.file.path);
      // borramos archivo local
      fs.unlink(req.file.path);

      // cargamos el objeto
      editUser.picture = result.secure_url;
    } catch (error) {
      // error al cargar imagen a cloudinary
      console.error("POST /users/:id/updateImage uploadImage error");
      return next(error);
    }
    try {
      // mandamos actualizar el usuario con id=id con los campos de editUser
      const user = await UserController.update(id, editUser);

      res.status(200).json(user);
    } catch (error) {
      // error al editar el usuario
      console.error("POST /users/:id/updateImage UserController.update error");
      next(error);
    }
  }
);

// PUT /users/:id/role
router.put("/:id/role", async (req, res, next) => {
  const { user_role } = req.body;
  const { id } = req.params;

  if (!user_role || !id) return res.status(400).send();

  try {
    await UserController.setUserRole(id, user_role);
    return res.status(200).json({ status: "Rol modificado" });
  } catch (error) {
    // atrapamos el error personalizado del controlador
    // mandamos un Bad Request con el mensaje de error
    if (error.name === "UserRoleNotFound")
      return res.status(400).json({ error: error.message });

    console.error("PUT /users/:id/set-role UserController.setUserRole error");
    next(error);
  }
});

// GET /users/:id
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!id) return res.status(400).send();

  try {
    const user = await UserController.findById(id);

    if (!user) return res.status(404).json({ error: "Not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("GET /users/:id UserController.findById error");
    next(error);
  }
});

module.exports = router;
