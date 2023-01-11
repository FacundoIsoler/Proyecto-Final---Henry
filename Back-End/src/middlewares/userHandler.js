const { Router } = require("express");
const { uploadMulter, uploadImage } = require ('../controllers/cloudinaryController');
const fs = require("fs-extra");
const router = Router();
const { Detail,  User, UserRol} = require("../db.js");

router.get("/", async (req, res) => {
  const { id } = req.query;

  try {
    if(id){
        let result = await User.findAll({
          where: {
            id: id,
          },
          include: [
            { model: Detail }, 
            { model: UserRol }
        ],
        });
        res.status(200).json(result)
    } else {
        let result = await User.findAll({
            include: [
                { model: Detail }, 
                { model: UserRol }
            ],
        })
        res.status(200).json(result)
    }
  } catch (error) {
    res.status(500).send("Hubo un error en el servidor")
  }
});

router.put("/", async (req, res) => {
    
  console.log(req.body);

  const { idModified, idPetitioner, userName, passWord, age, location, adress, phoneNumber, eMail, UserRolBody } = req.body;

  try {
    const userBDModified = await User.findAll({
        where: {
            id: idModified
        },
        include:{model: UserRol}
    })
    const userBDPetitioner = await User.findAll({
        where: {
            id: idPetitioner
        },
        include:{model: UserRol}
    })
    let rolPetitioner = userBDPetitioner[0].dataValues.UserRol.dataValues.name
    let rolModified = userBDModified[0].dataValues.UserRol.dataValues.name
    //Update User
    if (userName) {
        await User.update({
            userName: userName,
        }, {
            where: {
                id : idModified
            }
        })
    }
    if (passWord) {
        await User.update({
            passWord: passWord,
        }, {
            where: {
                id : idModified
            }
        })
    }
    if (age) {
        await User.update({
            age: age,
        }, {
            where: {
                id : idModified
            }
        })
    }

    //Update Details
    if (location) {
        await Detail.update({
            location: location,
        }, {
            where: {
                id : userBDModified[0].dataValues.DetailId
            }
        })
    }
    if (adress) {
        await Detail.update({
            adress: adress,
        }, {
            where: {
                id : userBDModified[0].dataValues.DetailId
            }
        })
    }
    if (phoneNumber) {
        await Detail.update({
            phoneNumber: phoneNumber,
        }, {
            where: {
                id : userBDModified[0].dataValues.DetailId
            }
        })
    }
    if (eMail) {
        await Detail.update({
            eMail: eMail,
        }, {
            where: {
                id : userBDModified[0].dataValues.DetailId
            }
        })
    }
    //Update rol
    if (UserRolBody) {
        if(rolPetitioner === "Admin" && rolModified === "Supplier" || rolModified === "User"){
            let rolDB = await UserRol.findAll({
                where: {
                    name : UserRolBody
                }
            })
            await User.update({
                UserRolId: rolDB[0].dataValues.id,
            }, {
                where: {
                    id : idModified
                }
            })
        } else if (rolPetitioner === "SuperAdmin") {
            let rolDB = await UserRol.findAll({
                where: {
                    name : UserRolBody
                }
            })
            await User.update({
                UserRolId: rolDB[0].dataValues.id,
            }, {
                where: {
                    id : idModified
                }
            })
        }
        else {
            return res.status(200).json("No tiene permisos para cambiar los roles")
        } 
    }

   
    res.status(200).json("Cambios cargados exitosamente!")
  } catch (error) {
    res.status(500).send("Hubo un error en el servidor");
  }
});

router.delete("/", async (req, res) => {
    const { idDelete, idPetitioner } = req.body;
  try {
    let userDBDelete = await User.findAll({
        where: {
            id: idDelete
        },
        include: {model:UserRol}
    })
    let userDBPetitioner = await User.findAll({
        where: {
            id: idPetitioner
        },
        include: {model:UserRol}
    })
    let UserDeletedRol = userDBDelete[0].dataValues.UserRol.dataValues.name
    let UserPetitionerRol = userDBPetitioner[0].dataValues.UserRol.dataValues.name
    if((UserDeletedRol === "Supplier" || UserDeletedRol === "User") && UserPetitionerRol === "Admin") {
        await User.destroy({
            where: {
                id: idDelete
            }
        })
        return res.send("Elimiando Exitosamente")
    } else if (UserPetitionerRol === "SuperAdmin") {
        await User.destroy({
            where: {
                id: idDelete
            }
        })
        return res.send("Elimiando Exitosamente")
    } else {
        res.send("No tiene permisos para modificar este usuario")
    }


    console.log(userDBDelete[0].dataValues.UserRol.dataValues.name);

   
  } catch (error) {
    res.status(500).send("Hubo un error en el servidor");
  }
});

router.post("/", async (req, res) => {
/*     {
        "userName" : "asdasd",
        "passWord" : "32",
        "age": 33,
        "location": "test",
        "adress": "teste",
        "phoneNumber": 9999999,
        "eMail": "teste@test.com",
        "UserRol": "Admin"
    } */
  const { userName, passWord, age, location, adress, phoneNumber, eMail, UserRolBody} = req.body;
  try {
    if(!userName || !passWord || !age || !location || !adress || !phoneNumber || !eMail || !UserRolBody) return res.status(200).send("Faltan datos obligatorios")
    let user = await User.create({
        userName: userName,
        passWord: passWord,
        age: age,
    })
    let deatils = await Detail.create({
        location: location,
        adress: adress,
        phoneNumber: phoneNumber,
        eMail: eMail,
    })
    let rol = await UserRol.findAll({
        where : {
            name: UserRolBody
        }
    }) 
    await user.setDetail(deatils.dataValues.id)
    await user.setUserRol(rol[0].dataValues.id)
    res.status(200).send("asd")
  } catch (error) {
    res.status(500).send("Hubo un error en el servidor");
  }
});

module.exports = router;
