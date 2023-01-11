const { Receipt } = require("../db");
  const { InternalError } = require("../errors");

  const add = async ({userId,name,phone,email,adress,location,CP,preferredTime}) => {

    try {
      const newReceipt = await Receipt.create({
        userId,
        name,
        phone,
        email,
        adress,
        location,
        CP,
        preference_time: preferredTime
      });
  
      // retornamos asi para mantener el formato consistente
      return newReceipt.id;

    } catch (error) {
      console.error(error);
      throw new InternalError(error);
    }
  };


  module.exports = {
    add,
  };