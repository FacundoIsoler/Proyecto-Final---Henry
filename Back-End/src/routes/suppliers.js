const { Router } = require("express");
const SupplierController = require("../controllers/SupplierController");
const {
  uploadImage,
  uploadMulter,
} = require("../controllers/cloudinaryController");
const fs = require("fs-extra");

const router = Router();

// GET /suppliers/:id? ?name= ?sort_by=
router.get("/:id?", async (req, res, next) => {
  const { name, sort_by } = req.query;
  const { id } = req.params;

  try {
    const dbSuppliers = id
      ? await SupplierController.findById(id) // buscamos por id especifico
      : await SupplierController.findByName(name, sort_by); // si name es null, entrega todos los suppliers

    if (!dbSuppliers)
      // no se encontraron suppliers
      return res.status(404).json({ error: "No hubo resultados" });

    return res.status(200).json(dbSuppliers);
  } catch (error) {
    next(error);
  }
});

// POST /suppliers
router.post(
  "/",
  uploadMulter("./public/Images").single("image"), // agregamos el middleware para procesamiento de archivos
  async (req, res, next) => {
    const { name, cuit, description, location, adress, phoneNumber, eMail } =
      req.body;
console.log('body',req.body)
    if (
      !name ||
      !cuit ||
      !description ||
      !location ||
      !adress ||
      !phoneNumber ||
      !eMail
    )
      return res
        .status(400)
        .json({ error: "Faltan datos obligatorios por cargar" });

    // definimos el nuevo objeto a crear
    const newSupplier = {
      name,
      cuit,
      description,
      location,
      adress,
      phoneNumber,
      eMail
    };

    // si se cargo un archivo, lo procesamos
    if (req.file) {
      try {
        // subimos a cloudinary
        const result = await uploadImage(req.file.path);
        // borramos el archivo local
        fs.unlink(req.file.path);

        // cargamos en el objeto a guardar la url de cloudinary
        newSupplier.logo = result.secure_url;
      } catch (error) {
        // ocurrio un error al cargar la imagen a cloudinary
        console.error("POST /suppliers uploadImage error");

        return next(error);
      }
    }

    try {
      // mandamos a controller los datos del nuevo supplier
      const dbSupplier = await SupplierController.add(newSupplier);

      return res.status(201).json(dbSupplier);
    } catch (error) {
      // ocurrio un error al guardar el supplier
      console.error("POST /suppliers SupplierController.add error");

      next(error);
    }
  }
);

router.put("/:id", async (req, res, next) => {

  const { isAuth, name, cuit, description, logo, location, adress, phoneNumber, eMail } = req.body;
  const { id } = req.params;

  console.log(isAuth)
  
  if(id && !name && !cuit && !description && !logo && !location && !adress && !phoneNumber && !eMail){
    try{
  
      const search = await SupplierController.findById(id);

      const changeAuth = await SupplierController.update(id, {
        name: search.name,
        cuit: search.cuit,
        description: search.description,
        logo: search.logo,
        location: search.Detail.location,
        adress: search.Detail.adress,
        phoneNumber: search.Detail.phoneNumber,
        eMail: search.Detail.eMail,
        isAuthorized: isAuth
      })
    
      return res.status(200).json(search);
  
    }catch(error){
      next(error)
    }
  }
})

module.exports = router;
