// const { Router } = require('express');
// const {assignSupplier, releaseSupplier} = require('../controllers/StockController')


// const router = Router();

// router.post("/", async (req, res, next) => {
// const {serviceId, amount} = req.body;
// console.log(req.body);
// try{
//     const supplierServiceId = await assignSupplier(serviceId, amount);
//     console.log('recibido en ruta',supplierServiceId);
//     res.status(201).send('ok')
// }catch(e){
//     console.log(e);
//     res.status(500).send(e);
// }
// })

// module.exports = router;