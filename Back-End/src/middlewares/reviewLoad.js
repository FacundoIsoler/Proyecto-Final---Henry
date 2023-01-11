/* const { Router } = require("express");
const router = Router();
const { Review,Service, User, Supplier, Service_Supplier, Op } = require("../db.js");


router.get("/:id", async (req, res) => {
    const { id } =  req.params
    try {
      let resultReview = await Review.findAll({
        include: {
          model: Service,
          where: {
            id: id
          }
        }
      });
      if(resultReview.length === 0 ) return res.status(200).json("No hay ninguna review cargada")
      res.status(200).json(resultReview)
    } catch (error) {
      res.status(500).send("Hubo un error en el servidor")
    }
})

router.post("/", async (req, res) => {
    const {comment, rating, serviceId, userId, serviceType} = req.body
    //http://localhost:3001/review
  try {
    if(!comment || !rating) res.send("Faltan datos obligatorios por cargar")
    //create
    let reviewDB = await Review.create({
        comment: comment,
        rating: rating
    })

    const searchService = await Supplier.findAll ({
      where: {
        id: serviceId
      },
      include: {
        model: Service,
        where: {
          serviceType: serviceType
        }
      },
      raw: true
    })

    console.log(searchService, "SearchService")
    console.log(searchService[0]["Services.Service_Supplier.ServiceId"], "PRUEBA")
    //Search user and service
     let userDB = await User.findByPk(userId, {raw:true}) 
    //let serviceDB = await Service.findByPk(searchService[0]["Services.Service_Supplier.ServiceId"], {raw:true}) 

    console.log(userDB.id, "USER")
   // console.log(serviceDB.id, "SERVICE")

     await reviewDB.setUser(userDB.id)
     await reviewDB.setService(searchService[0]["Services.Service_Supplier.ServiceId"])
     //await reviewDB.setService(serviceDB.dataValues.id) 
    res.status(200).json("Review Cargada Exitosamente ")
  } catch (error) {
    res.status(500).send("Hubo un error en el servidor" + error)
  }
});

module.exports = router; */