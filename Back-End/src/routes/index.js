const { Router } = require("express");

const suppliers = require("./suppliers");
const services = require("./services");
const review = require("./review");
const service = require("./service");
const category = require("./category");
const location = require("./location");
const userHandler = require("./userHandler");
const createPreference = require("./preference");
const users = require("./users");
const notifications = require("./notifications.js");
// const roles = require("./roles");
// const UsersSearch = require("./UsersSearch");
const contracts = require("./contracts");
//const stock = require("./stock");
const receipt = require("./receipt");

const router = Router();

// TODO: lo correcto seria utilizar el plural para cada endpoint
// TODO: corregir 'reviews', 'services', 'categories', 'locations'
// TODO: valorar reemplazar 'userHandler' por 'users' o algun otro
// TODO: dependiendo de implementacion de Auth0
router.use("/users", users);

router.use("/suppliers", suppliers);
router.use("/services", services);
router.use("/review", review);
router.use("/service", service);
router.use("/category", category);
router.use("/location", location);
router.use("/userHandler", userHandler);
router.use("/create_preference", createPreference);
router.use("/notifications", notifications);
// router.use("/roles", roles);
// router.use("/users", UsersSearch);
router.use("/contracts", contracts);
//router.use("/stock",stock);
router.use("/receipt", receipt);

module.exports = router;
