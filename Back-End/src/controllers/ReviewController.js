const {
    Contract,
    Supplier,
    User,
    Review,
    Op,
    fn,
    conn,
  } = require("../db");

  const findQuery = {
    include: [Supplier, User, Review],
    order: [["date", "DESC"]],
  };

  const findById = async (id) => {
    try {
      const dbContract = await Contract.findByPk(id, findQuery);
  
      return dbContract;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

const contractData = async (contractId) => {
  try {
    const contract = await Contract.findAll({
      where: {
        id: contractId,
      },
    });

    return await findById(contractId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const newReview = async (objReview) => {
    try {
        const newReview = await Review.create (objReview)

        return await findById(newReview.dataValues.id);
    } catch (error) {
        console.error(error);
        throw error;
      }
}

const reviewPerService = async (id) => {
    try {
        return await Review.findAll({
            where: {
                ServiceId: id
            }
        })
    } catch (error) {
        console.error(error);
        throw error;
      }
}

const reviewUser = async (id) => {
    try {
        return await Review.findAll({
            include: [
                { model: User ,
                    where: {
                        id: id
                    }
                }, 
            ],
        })
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = {
    contractData,
    newReview,
    reviewPerService,
    reviewUser
  };
  