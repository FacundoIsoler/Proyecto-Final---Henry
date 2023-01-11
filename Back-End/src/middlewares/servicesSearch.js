const {Service, Supplier, Category, Op} = require('../db.js');
const { Router } = require('express');
const router = Router();

router.get('/', async (req, res, next) => {
  try{
    //http://localhost:3000/services?type=Limpieza   
    const {type} = req.query;

    if(type){

      const result = await Service.findAll({
        where: { 
        //ESTA ES LA SOLUCION DEL BUG DE LOS ACENTOS EN LA SEARCHBAR, PERO FALTA INSTALAR LA EXTENSION DE POSTGRES
            /* 
          [Op.or] : [
            {
              where: conn.where(
                conn.fn('unaccent', conn.col('serviceType')),{
                [Op.iLike]: `%${type}%`
                })
            },
            {
              serviceType : {
                [Op.iLike]: `%${type}%` 
                //case insensitive, busca aunque no sea un matcheo exacto en cualquier lugar del texto.
                 //EJEM: si se busca "lim" trae todos los services que lleven lim (Limpieza de techos, Limpieza de cloacas, etc)
              }
            }
          ]} */
        
            serviceType : {
                [Op.iLike]: `%${type}%` 
                //case insensitive, busca aunque no sea un matcheo exacto en cualquier lugar del texto.
                 //EJEM: si se busca "lim" trae todos los services que lleven lim (Limpieza de techos, Limpieza de cloacas, etc)
              } }
        ,
        include: [{
          model: Supplier,
          attributes: ["name"]
        },
        {
          model: Category,
          attributes: ["name"]
        }],
        raw: true,
        nest: true
      })

      console.log(result.length)

      result.length > 0 ? res.status(200).json(result) : res.send("No se encontro ningún servicio con ese nombre");

    }else {   //http://localhost:3000/services
  
      const result = await Service.findAll({

        include: [{
          model: Supplier,
          attributes: ["name"]
        },
        {
          model: Category,
          attributes: ["name"]
        }],
        raw: true,
        nest: true
      });
      
      res.status(200).json(result);
    }


  }catch(error){
    next(error)
  }

})



router.get('/:id', async (req, res) => {
  const { id } = req.params;
  let detail = {};
  //http://localhost:3001/services/id
  try{
      detail = await Service.findAll({
        where: {
          id: id
        },
          include: [{
            model: Supplier,
            attributes: ["name", "stock", "isAuthorized"]
          },
          {
            model: Category,
            attributes: ["name"]
          },
        ]
      });

      if(detail === null) return res.status(404).send('Servicio no encontrado');

      else return res.status(200).send(detail);

  } catch(e){
      return res.status(500).send('Hubo un error en el servidor');
  }
});

router.delete("/:id", async (req, res, next ) => {

  try{
      const { id } = req.params;

      await Service.destroy({
          where: {
              id
          }
      })

      return res.status(200).json("El servicio ha sido elimiando satisfactoriamente!");

  }catch(error){
    console.log(error)
      next(error)
  }
})

router.put("/:id", async (req, res, next) => {

  try{

    const { id } = req.params;

    const { name, price, description, image, categoryId, suppliersId} = req.body;

    const searchService = await Service.findByPk(id,{
      include: {
        model: Category
      }
    })

    if(!searchService) return res.status(404).json("No existe dicho servicio");

    if(name){
      await Service.update({
        serviceType: name
      },{
        where: { id }
      })
    }

    if(price){
      await Service.update({
        pricePerHour: price
      },{
        where: { id }
      })
    }

    if(description){
      await Service.update({
        description: description
      },{
        where: { id }
      })
    }

    if(categoryId){

      await searchService.setCategory(categoryId);

    }

    if(suppliersId){
      
      await searchService.addSupplier(suppliersId)
    }

    return res.status(200).json("Actualización del servicio exitosa!");

  }catch(error){
    next(error)
  }
})
  
module.exports = router;