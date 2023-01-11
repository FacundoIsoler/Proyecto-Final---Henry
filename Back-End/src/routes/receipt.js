const { Router } = require("express");
const ReceiptController = require("../controllers/ReceiptController");

const router = Router();

router.post("/", async (req, res, next) => {

  console.log('body de receipts',req.body)
  let { name, phone, email, adress, location, CP, preferredTime } = req.body.userData;
  let { userId } = req.body;
console.log(userId)
    if ( !userId || !name || !phone || !email || !adress || !location)
      return res
        .status(400)
        .json({ error: "Faltan datos obligatorios por cargar" });
   
    const newReceipt = {userId, name, phone, email, adress, location, CP, preferredTime}
    
    try {
      
      const receiptId = await ReceiptController.add(newReceipt);
  
      return res.status(201).json(receiptId);

    } catch (error) {
        console.error("POST /receipt ContractReceipt.add error");

         next(error);
    }
  });
  

module.exports = router;