const server = require("./src/app.js");
const {
  conn,
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
  Op,
  fn,
} = require("./src/db.js");
const rols = require("./Datos/UserRols.json");
const users = require("./Datos/Users.json");
const suppliers = require("./Datos/Suppliers.json");
const services = require("./Datos/Services.json");
const categories = require("./Datos/Categories.json");
const details = require("./Datos/Details.json");

const PORT = process.env.PORT || 3001;

servCat = {
  Reparación: 1,
  Limpieza: 2,
  Lavado: 3,
  Planchado: 4,
  Desinfección: 6,
  Fumigación: 7,
  Plomería: 8,
  Termotanques: 8,
  Electricidad: 9,
  Aires: 9,
  Pintura: 10,
  Construcción: 11,
  Aberturas: 11,
  Durlock: 11,
  Herrería: 12,
  Carpintería: 13,
};

const roles = {
  Nadia: 3,
  Kevin: 2,
  Sandra: 4,
};

let suppliersIDs = [];

conn
  .sync({ force: true })
  .then(async () => {
    // some code
    await Detail.bulkCreate(details);
    await Category.bulkCreate(categories);
    await UserRol.bulkCreate(rols);

    const dbSuppliers = await Supplier.bulkCreate(suppliers);
    const dbServices = await Service.bulkCreate(services);
    const dbUsers = await User.bulkCreate(users);

    for (let dbUser of dbUsers) {
      await dbUser.setUserRol(roles[dbUser.userName] ?? 1);
      await dbUser.setDetail(1);
    }

    for (let dbSupplier of dbSuppliers) {
      await dbSupplier.setDetail(2);
      suppliersIDs.push(dbSupplier.id);
    }

    for (let dbService of dbServices) {
      let servTypeWords = dbService.serviceType.split(" ");

      // Agregamos servicios
      if (servCat.hasOwnProperty(servTypeWords[0])) {
        await dbService.setCategory(servCat[servTypeWords[0]]);
      } else if (
        ["espacios verdes", "árboles", "jardines"].some((palabra) =>
          dbService.description.includes(palabra)
        )
      ) {
        await dbService.setCategory(5);
      } else {
        await dbService.setCategory(14);
      }

      // Asignamos servicios a suppliers
      if (servTypeWords === "Techos") {
        await dbService.addSupplier(suppliersIDs[3]);
        await dbService.addSupplier(suppliersIDs[2]);
      } else if (servTypeWords[2] === "Paredes") {
        await dbService.addSupplier(suppliersIDs[1]);
        await dbService.addSupplier(suppliersIDs[0]);
      } else if (
        servTypeWords[2] === "Hogares" ||
        servTypeWords[2] === "Hospitales"
      ) {
        await dbService.addSupplier(suppliersIDs[0]);
        await dbService.addSupplier(suppliersIDs[1]);
      } else {
        await dbService.addSupplier(suppliersIDs[2]);
      }
    }

    await SupplierService.sync({ force: false });
    const dbSupServices = await SupplierService.findAll({
      include: [Supplier],
    });

    for (let dbSS of dbSupServices) {
      // Generamos aleatoriamente contratos por servicio
      // Y sus respectivos reviews
      const cant = parseInt(Math.random() * 4);
      // console.log(dbSS.id, cant);

      for (let i = 0; i < cant; i++) {
        const user = await User.findOne({ order: fn("random") });
        const service = await Service.findOne({ 
            order: fn("random") ,
            include: {
                model: Supplier,
                where: {
                    id :  dbSS.Supplier.id
                }
              },
        });

        const newContract = await Contract.create({
          date: Date.now(),
          UserId: user.id,
          SupplierServiceId: dbSS.id,
          SupplierId: dbSS.Supplier.id,
        });

        const rating = parseFloat((Math.random() * 5).toFixed(1));

        const newReview = await Review.create({
          comment: `comentario con rating ${rating}`,
          rating,
          UserId: user.id,
          ContractId: newContract.id,
          SupplierId: dbSS.Supplier.id,
          ServiceId: service.dataValues.id
        });
      }
    }
  })
  .then(() =>
    server.listen(PORT, () => {
      console.log("Server listening at " + PORT);
    })
  )
  .catch((error) => console.error(error));

/*
conn.sync({ force: true }).then(() =>
  Detail.bulkCreate(details).then(() =>
    Category.bulkCreate(categories).then(() =>
      UserRol.bulkCreate(rols).then(() =>
        User.bulkCreate(users)
          .then((dbUsers) => {
            console.log("dbUsers", dbUsers.length);

            dbUsers.forEach(async (dbUser) => {
              await dbUser.setUserRol(roles[dbUser.userName] ?? "User");
              await dbUser.setDetail(1);
            });

            return Supplier.bulkCreate(suppliers);
          })
          .then((dbSuppliers) => {
            console.log("dbSuppliers", dbSuppliers.length);

            dbSuppliers.forEach(async (suppliersBD) => {
              await suppliersBD.setDetail(2);
              supplietUUID.push(suppliersBD.dataValues.id);
            });

            return Service.bulkCreate(services);
          })
          .then((dbServices) => {
            console.log("dbServices", dbServices.length);

            dbServices.forEach(async (serviceBD) => {
              // console.log(serviceBD);
              let servTypeWords = serviceBD.serviceType.split(" ");
              let description = serviceBD.description;

              // Agregamos servicios
              if (servCat.hasOwnProperty(servTypeWords[0])) {
                await serviceBD.setCategory(servCat[servTypeWords[0]]);
              } else if (
                ["espacios verdes", "árboles", "jardines"].some((palabra) =>
                  description.includes(palabra)
                )
              ) {
                await serviceBD.setCategory(5);
              } else {
                await serviceBD.setCategory(14);
              }

              // Asignamos servicios a suppliers
              if (servTypeWords === "Techos") {
                await serviceBD.addSupplier(supplietUUID[3]);
                await serviceBD.addSupplier(supplietUUID[2]);
              } else if (servTypeWords[2] === "Paredes") {
                await serviceBD.addSupplier(supplietUUID[1]);
                await serviceBD.addSupplier(supplietUUID[0]);
              } else if (
                servTypeWords[2] === "Hogares" ||
                servTypeWords[2] === "Hospitales"
              ) {
                await serviceBD.addSupplier(supplietUUID[0]);
                await serviceBD.addSupplier(supplietUUID[1]);
              } else {
                await serviceBD.addSupplier(supplietUUID[2]);
              }
            });

            return SupplierService.sync({ force: false });
          })
          .then(() =>
            SupplierService.findAll({
              include: [Supplier],
            })
          )
          .then((supServices) => {
            console.log("supServices", supServices.length);

            return supServices.forEach((ss) => {
              // Generamos aleatoriamente contratos por servicio
              // Y sus respectivos reviews
              const cant = parseInt(Math.random() * 4);
              console.log(ss.id, cant)

              for (let i = 0; i < cant; i++) {
                User.findOne({ order: fn("random") }).then((user) =>
                  Contract.create({
                    date: Date.now(),
                    UserId: user.id,
                    SupplierServiceId: ss.id,
                    SupplierId: ss.Supplier.id,
                  })
                    .then((newContract) => {
                      let rating = parseFloat((Math.random() * 5).toFixed(1));

                      return Review.create({
                        comment: `comentario con rating ${rating}`,
                        rating,
                        UserId: user.id,
                        ContractId: newContract.id,
                        SupplierId: ss.Supplier.id,
                      });
                    })
                    .then((newReview) => console.log(newReview.id))
                );
              }
            });
          })
          .then(() =>
            server.listen(PORT, () => {
              console.log("Server listening at " + PORT);
            })
          )
      )
    )
  )
);
*/
//           .then(async () => {
//             const dbUsers = await User.findAll();

//             dbUsers.forEach(async (dbUser) => {
//               await dbUser.setUserRol(roles[dbUser.userName] ?? "User");
//               await dbUser.setDetail(1);
//             });

//             return "bulkCreateUsers";
//           })
//           .then((ret) => {
//             console.log(ret);

//             return Supplier.bulkCreate(suppliers).then(async () => {
//               const dbSuppliers = await Supplier.findAll();

//               dbSuppliers.forEach(async (suppliersBD) => {
//                 await suppliersBD.setDetail(2);
//                 supplietUUID.push(suppliersBD.dataValues.id);
//               });

//               return Service.bulkCreate(services).then(async () => {
//                 const dbServices = await Service.findAll();

//                 dbServices.forEach(async (serviceBD) => {
//                   let servTypeWords = serviceBD.serviceType.split(" ");
//                   let description = serviceBD.description;

//                   // Agregamos servicios
//                   if (servCat.hasOwnProperty(servTypeWords[0])) {
//                     await serviceBD.setCategory(servCat[servTypeWords[0]]);
//                   } else if (
//                     ["espacios verdes", "árboles", "jardines"].some((palabra) =>
//                       description.includes(palabra)
//                     )
//                   ) {
//                     await serviceBD.setCategory(5);
//                   } else {
//                     await serviceBD.setCategory(14);
//                   }

//                   // Asignamos servicios a suppliers
//                   if (servTypeWords === "Techos") {
//                     await serviceBD.addSupplier(supplietUUID[3]);
//                   } else if (servTypeWords[2] === "Paredes") {
//                     await serviceBD.addSupplier(supplietUUID[1]);
//                   } else if (
//                     servTypeWords[2] === "Hogares" ||
//                     servTypeWords[2] === "Hospitales"
//                   ) {
//                     await serviceBD.addSupplier(supplietUUID[0]);
//                   } else {
//                     await serviceBD.addSupplier(supplietUUID[2]);
//                   }
//                 });

//                 //   return true;
//                 // })
//                 // .then(async () => {
//                 const supServices = await SupplierService.findAll({
//                   include: [Supplier],
//                 });
//                 console.log("supServices", supServices.length);

//                 supServices.forEach(async (ss) => {
//                   // Generamos aleatoriamente contratos por servicio
//                   // Y sus respectivos reviews
//                   for (let i = 0; i < parseInt(Math.random() * 4); i++) {
//                     let user = await User.findOne({ order: fn("random") });
//                     console.log("user", user.id);
//                     let newContract = await Contract.create({
//                       date: Date.now(),
//                       UserId: user.id,
//                       SupplierServiceId: ss.id,
//                       SupplierId: ss.Supplier.id,
//                     });
//                     console.log("cont", newContract.id);
//                     let rating = parseFloat((Math.random() * 5).toFixed(1));

//                     let newReview = await Review.create({
//                       comment: `comentario con rating ${rating}`,
//                       rating,
//                     });
//                     console.log("rev", newReview.id);
//                     await newContract.setReview(newReview);
//                   }
//                 });

//                 //   return true;
//                 // })
//                 // .then(() => {
//                 return server.listen(PORT, () => {
//                   console.log("Server listening at " + PORT);
//                 });
//               });
//             });
//           })
//       )
//     )
//   );
// });

//Category
// categories.forEach(async (category) => await Category.create(category));
//Rols
// rols.forEach(async (rol) => await UserRol.create(rol));
//Users
// users.forEach(async (user) => {
//   let { userName } = user;
//   let userBD = await User.create(user);

//   const roles = {
//     Nadia: "Admin",
//     Kevin: "Supplier",
//     Sandra: "SuperAdmin",
//   };

//   await userBD.setUserRol(roles[userName] ?? "User");

//   await userBD.setDetail(1);
// });
//ProveedoresLimpieza S.A.
// suppliers.forEach(async (supplier) => {
//   let suppliersBD = await Supplier.create(supplier);
//   await suppliersBD.setDetail(2);
//   supplietUUID.push(suppliersBD.dataValues.id);
// });
//Services

//     services.forEach(async (service) => {
//       let serviceBD = await Service.create(service);
//       let servTypeWords = service.serviceType.split(" ");
//       let description = service.description;

//       // Agregamos servicios
//       if (servCat.hasOwnProperty(servTypeWords[0])) {
//         await serviceBD.setCategory(servCat[servTypeWords[0]]);
//       } else if (
//         ["espacios verdes", "árboles", "jardines"].some((palabra) =>
//           description.includes(palabra)
//         )
//       ) {
//         await serviceBD.setCategory(5);
//       } else {
//         await serviceBD.setCategory(14);
//       }

//       /*
// const ids = await Supplier.findAll({
//   where: {
//       description : {
//           [Op.iLike]: `%${service.serviceType}%` //case insensitive, busca aunque no sea un matcheo exacto en cualquier lugar del texto.
//       }                           //EJEM: si se busca "lim" trae todos los services que lleven lim (Limpieza de techos, Limpieza de cloacas, etc)
//   }});
//   console.log(ids)
//   console.log(service.serviceType)
//   for(let i=0;i<ids.length;i++){
//     await serviceBD.addSupplier(ids[i]);
//   }
// */

//       // Asignamos servicios a suppliers
//       if (servTypeWords === "Techos") {
//         await serviceBD.addSupplier(supplietUUID[3]);
//       } else if (servTypeWords[2] === "Paredes") {
//         await serviceBD.addSupplier(supplietUUID[1]);
//       } else if (
//         servTypeWords[2] === "Hogares" ||
//         servTypeWords[2] === "Hospitales"
//       ) {
//         await serviceBD.addSupplier(supplietUUID[0]);
//       } else {
//         await serviceBD.addSupplier(supplietUUID[2]);
//       }
//       // await serviceBD.save();
//       // const userReviewer = await User.findOne();

//       // for (let i = 0; i < 5; i++) {
//       //   let newReview = await Review.create({
//       //     comment: "something",
//       //     rating: parseFloat((Math.random() * 5).toFixed(1)),
//       //   });
//       //   await newReview.setUser(userReviewer);
//       //   await serviceBD.addReview(newReview);
//       // }
//     });
// })
// .then(() => {
//   server.listen(PORT, () => {
//     console.log("Server listening at " + PORT);
//   });
// });
