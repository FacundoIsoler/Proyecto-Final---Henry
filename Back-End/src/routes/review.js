const { Router } = require("express");
const ReviewController = require("../controllers/ReviewController");
const {
    Contract,
    Supplier,
    User,
    ServiceSupplier,
    Review,
    Service,
    SupplierServices,
    Op,
    fn,
    conn,
  } = require("../db");
const router = Router();

//Devuelve todas las review de un servicio, por id
router.get("/:id", async (req, res) => {
    const {id} = req.params
    try {
        const result = await ReviewController.reviewPerService(id)
        if(result.length === 0 ) return res.status(200).json("No hay ninguna review cargada")
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send("Hubo un error en el servidor" + error)
    }
})

//Cargar reviews
/* {
    "comment" : "test",
    "rating": 3.08,
    "contractId": "1"
} */
router.post("/", async (req, res) => {
    const {comment, rating, contractId} = req.body
    //http://localhost:3001/review
  try {
    if(!comment || !rating) res.send("Faltan datos obligatorios por cargar")

    const contractData = await ReviewController.contractData(contractId)
    const objReview = {
        comment: comment,
        rating: rating,
        ContractId: contractData.dataValues.id,
        SupplierId: contractData.dataValues.SupplierId,
        UserId: contractData.dataValues.UserId,
        ServiceId: contractData.dataValues.SupplierServiceId
    }
    const newReview = await ReviewController.newReview(objReview)

    res.status(200).send("Comentario cargado exitosamente!")
  } catch (error) {
    res.status(500).send("Hubo un error en el servidor" + error)
  }
});


//Devuelve todas las review de un user
router.get("/", async (req, res) => {
        //http://localhost:3001/review?id=1z
    const {id} = req.query
    try {
        const result = await ReviewController.reviewUser(id)
        if(result.length === 0 ) return res.status(200).json("No hay ninguna review cargada")
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send("Hubo un error en el servidor" + error)
    }
})



module.exports = router;