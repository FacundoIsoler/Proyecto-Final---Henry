require("dotenv").config();
const { Sequelize, Op, fn } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME = process.env.DB_NAME || "PF_ECOMMERCE";

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false,
    native: false,
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) =>
    modelDefiners.push(require(path.join(__dirname, "/models", file)))
  );

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  Category,
  Contract,
  Detail,
  Review,
  Service,
  Supplier,
  SupplierService,
  User,
  UserLogin,
  UserRol,
  Receipt
} = sequelize.models; //destructurin de los modelos.

//1aN Categorias de servicios
Category.hasMany(Service);
Service.belongsTo(Category);

// //NaN Usuarios y servicios
// Service.belongsToMany(User, { through: "Service_User"})
// User.belongsToMany(Service, { through: "Service_User"})

//1aN Usuarios y Roles
UserRol.hasMany(User);
User.belongsTo(UserRol);

// User tiene varios UserLogins
User.hasMany(UserLogin);
UserLogin.belongsTo(User);

// //1aN Review y Servicios
 Service.hasMany(Review)
 Review.belongsTo(Service)

// //1aN Review y Users
// User.hasMany(Review)
// Review.belongsTo(User)

//1a1 Details y Supplier
Detail.hasOne(Supplier);
Supplier.belongsTo(Detail);

//1a1 Details y User
Detail.hasOne(User);
User.belongsTo(Detail);

// Supplier tiene multiples servicios
Service.belongsToMany(Supplier, { through: SupplierService });
Supplier.belongsToMany(Service, { through: SupplierService });

// Supplier.hasMany(SupplierService)
SupplierService.belongsTo(Supplier)

// Service.hasMany(SupplierService)
SupplierService.belongsTo(Service)

// User.belongsToMany(SupplierService, { through: Contract });
// SupplierService.belongsToMany(User, { through: Contract });

// User.belongsToMany(SupplierService)
// User

SupplierService.hasMany(Contract);
Contract.belongsTo(SupplierService) 

Supplier.hasMany(Contract);
Contract.belongsTo(Supplier);

Supplier.hasMany(Review);
Review.belongsTo(Supplier);

// Contract hasOne Review
//TODO y hasOne Payment
Contract.hasOne(Review);
Review.belongsTo(Contract);

// User tienen multiples contratos
User.hasMany(Contract);
Contract.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

//Receipt hasMany Contracts y Contracts belongsTo Receipt
Receipt.hasMany(Contract);
Contract.belongsTo(Receipt);

//TODO CHEQUEAR
// User.belongsToMany(Review, { through: "User_Reviews" });
// Review.belongsToMany(User, { through: "User_Reviews" });

// Quedaria pendiente unir:
// --- categorias con suppliers
// --- supplier con

module.exports = {
  ...sequelize.models, // importacion de los modelos
  conn: sequelize, // importacion de la conexion
  Op,
  fn
};
