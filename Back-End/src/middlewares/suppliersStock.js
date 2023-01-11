// const {Service, Supplier, Category, Op, conn} = require('../db.js');
// const { Router } = require('express');
// const router = Router();


// // asignar supplier, descontar stock, devolver el turno asignado.
// router.post('/asignar', async (req,res, next) => {
//     const { userId, cart } = req.body;
//     console.log(req.body)
//     //carrito:[{serviceId,amount},{},{}]
//     let response = {
//      userId: userId
//     }
   
//      try{
   
//    for(let i=0; i<cart.length; i++){
//      if(!cart[i].serviceId || !cart[i].amount) return res.status(400).send('Faltan datos requeridos');
//    //Traigo el servicio
//      var result = await Service.findByPk(cart[i].serviceId,{
//        include: [{
//          model: Supplier
//        }]
//      });
//    //Recorro los suppliers del servicio. El primero con stock disponible lo tomo y actualizo el stock.
//      let supplierContracted = 0;
//      for (let j=0; j<result.Suppliers.length; j++) {
//        if(supplierContracted === 0 && result.Suppliers[j].stock - cart[i].amount >= 0) {
//          await Supplier.update({
//            stock: result.Suppliers[j].stock - cart[i].amount
//          },{
//            where:{
//              id: result.Suppliers[j].id 
//            }
//          });
//          supplierContracted = result.Suppliers[j].id;
//          console.log('supplierContracted',supplierContracted)
//        } 
//      }
//    //Después de actualizar stock, actualizo el estado disponible del servicio
//    let acum = 0;
//          for (let k=0; k<result.Suppliers.length; k++){
//            acum = acum + result.Suppliers[k].stock; 
//            console.log(acum);
//          }
//            if(acum === 0) {
//              await Service.update({
//                disponible: false
//              }, {
//                where:{
//                  id: cart[i].serviceId
//                }
//              });
//            } else {
//              await Service.update({
//                disponible: true
//              }, {
//                where:{
//                  id: cart[i].serviceId
//                }
//              });
//        }
//    //Verifico si se encontró supplier con turnos disponibles
//    if(supplierContracted === 0){
//      return res.status(400).send(`El servicio ${result.serviceType} no tiene más turnos disponibles. Intente de nuevo`);
//    } else {
//      response = {...response,
//      [`service${i+1}`] : {
//        serviceId: cart[i].serviceId,
//        supplierId: supplierContracted,
//        amount: cart[i].amount
//      }};
//    }
   
//    }
//        return res.status(201).send(response);
     
//        }
//      catch(e){
//        console.log(e);
//        return res.status(500).send(e)
//      }
     
//      });
   
//      //Liberar turno
//      router.post('/liberar', async (req,res, next) => {
//        const {serviceId, supplierId, cantidad} = req.body;
//        console.log(req.body)
//        try {
//          if(!serviceId || !supplierId || !cantidad) return res.status(400).send('Faltan Datos requeridos');
   
//          result = await Supplier.findByPk(supplierId);
   
//          if(result.stock >= 8) return res.status(400).send('Todos los turnos ya se encuentran liberados');
//          await Supplier.update({
//            stock: result.stock - cantidad
//          },{
//            where:{
//              id: supplierId 
//            }
//          });
   
         
//          var result = await Service.findByPk(serviceId,{
//            include: [{
//              model: Supplier
//            }]
//          });
   
//          let acum = 0;
//          for (let i=0; i<result.Suppliers.length; i++){
//            acum = acum + result.Suppliers[i].stock; 
//          }
//            if(acum === 0) {
//              await Service.update({
//                disponible: false
//              }, {
//                where:{
//                  id: serviceId
//                }
//              });
//            } else {
//              await Service.update({
//                disponible: true
//              }, {
//                where:{
//                  id: serviceId
//                }
//              });
//            }
//            return res.status(201).send('Turno liberado')
//        } catch(e){
//          console.log(e);
//        return res.status(500).send(e)
//        }
//      });

  
//   module.exports = router;
  
