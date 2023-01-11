const { Service, Supplier, SupplierService } = require('../db.js');

const updateServiceStock = async (supplierId) => { 
    try{

        const serviceIds = await SupplierService.findAll({
            where:{
                SupplierId:supplierId
            }
        });
        console.log('ids',serviceIds[0].ServiceId)

     for(let k=0; k<serviceIds.length; k++){
            var result = await Service.findByPk(serviceIds[k].ServiceId,{
                include: [{
                  model: Supplier
                }]
              });
        
              let acum = 0;
              for (let i=0; i<result.Suppliers.length; i++){
                acum = acum + result.Suppliers[i].stock; 
              }
                if(acum === 0) {
                  await Service.update({
                    disponible: false
                  }, {
                    where:{
                      id: serviceIds[k].ServiceId
                    }
                  });
                } else {
                  await Service.update({
                    disponible: true
                  }, {
                    where:{
                      id: serviceIds[k].ServiceId
                    }
                  });
                }}
    return;
    } catch(e) {
        console.log(e);
        throw Error ('Algo salió mal');
    }
};
    
const assignSupplier = async (serviceId, amount) => {
    try{
//Traigo el servicio
var result = await Service.findByPk(serviceId,{
    include: [{
      model: Supplier
    }]
  });
  console.log(result.Suppliers)
  //Recorro los suppliers del servicio. El primero con stock disponible lo tomo y actualizo el stock.
  let supplierContracted = 0;
  for (let i=0; i<result.Suppliers.length; i++) {
    if(supplierContracted === 0 && result.Suppliers[i].stock - amount >= 0) {
      await Supplier.update({
        stock: result.Suppliers[i].stock - amount
      },{
        where:{
          id: result.Suppliers[i].id 
        }
      });
      supplierContracted = result.Suppliers[i].id;
    } }
    //Verifico si se encontró supplier con turnos disponibles
   if(supplierContracted === 0){
    throw Error(`El servicio ${result.serviceType} no tiene más turnos disponibles. Intente de nuevo`);
  } else {
        //Después de actualizar stock, actualizo el estado disponible del servicio
        await updateServiceStock(supplierContracted)
    
const supplierService = await SupplierService.findAll({
    where:{
        ServiceId: serviceId,
        SupplierId: supplierContracted

    }
});
        return supplierService[0].id;
  }
    } catch(e){
        console.log(e);
        throw Error (e);
    }
};

const releaseSupplier = async (SupplierServiceId, amount = 1) => {
    try{
        const supplier = await SupplierService.findByPk(SupplierServiceId);
        console.log(supplier)
        const result = await Supplier.findByPk(supplier.SupplierId);

        if(result.stock >= 8) throw Error ('Todos los turnos ya se encuentran liberados');

        await Supplier.update({
            stock: result.stock + amount
          },{
            where:{
              id: supplier.SupplierId
            }
          });

          //actualizar disponibilidad de los servicios
          updateServiceStock(supplier.SupplierId);

          return 'Turno liberado';
    }catch(e){
        console.log(e);
        throw Error (e);
    }
};


module.exports = {
    assignSupplier,
    releaseSupplier,
  };