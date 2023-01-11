const {
  Contract,
  Supplier,
  User,
  SupplierService,
  Review,
  Receipt,
  Op,
  fn,
  conn,
} = require("../db");
const { ResourceNotFound, InternalError } = require("../errors");
const { ForeignKeyConstraintError } = require("sequelize");
const {releaseSupplier} = require('../controllers/StockController');

const findQuery = {
  include: [Supplier, User, Review, Receipt],
  order: [["date", "DESC"]],
};

const findSupplierBySupplierService = async (SupplierServiceId) => {
  try {
    const dbSupService = await SupplierService.findByPk(SupplierServiceId);

    return dbSupService ? dbSupService.SupplierId : null;
  } catch (error) {
    console.error(error);
    throw new InternalError(error);
  }
};

const add = async ({ date, UserId, SupplierServiceId, receiptId }) => {
  let SupplierId;

  try {
    SupplierId = await findSupplierBySupplierService(SupplierServiceId);
    if (!SupplierId)
      throw new ResourceNotFound(
        SupplierServiceId,
        "SupplierService",
        "ContractController.add",
        "findSupplierBySupplierService"
      );
  } catch (error) {
    console.error(error);
    throw new InternalError(error);
  }

  try {
    const newContract = await Contract.create({
      date,
      UserId,
      SupplierServiceId,
      SupplierId
    });

    newContract.setReceipt(receiptId);
    // retornamos asi para mantener el formato consistente
    return await findById(newContract.id);
  } catch (error) {
    // el unico foreign key que podria fallar es user id
    // mandamos custom error
    if (error instanceof ForeignKeyConstraintError)
      throw new ResourceNotFound(UserId, "User", "ContractController", "add");

    console.error(error);
    throw new InternalError(error);
  }
};

const update = async (id, { date, UserId, SupplierServiceId, status }) => {
  let SupplierId;

  if (SupplierServiceId) {
    // Si se modifico SupplierService, buscamos SupplierId

    try {
      SupplierId = await findSupplierBySupplierService(SupplierServiceId);
      if (!SupplierId)
        throw new ResourceNotFound(
          SupplierServiceId,
          "SupplierService",
          "ContractController.update",
          "findSupplierBySupplierService"
        );
    } catch (error) {
      console.error(error);
      throw new InternalError(error);
    }
  }

  try {
    const updateContract = await Contract.update(
      { date, UserId, SupplierServiceId, SupplierId, status}, 
      { where: { id } }
    );

    if (updateContract[0] === 0)
      throw new ResourceNotFound(
        id,
        "Contract",
        "ContractController",
        "update"
      );

      if(status === 'CANCELADA' || status === 'COMPLETADA'){
        //liberar el stock del supplier
        releaseSupplier(SupplierServiceId);
      }
    // retornamos asi para mantener el formato consistente
    return await findById(id);
  } catch (error) {
    // el unico foreign key que podria fallar es user id
    // mandamos custom error
    if (error instanceof ForeignKeyConstraintError)
      throw new ResourceNotFound(
        UserId,
        "User",
        "ContractController",
        "update"
      );

    console.error(error);
    throw new InternalError(error);
  }
};

const remove = async (id) => {
  try {
    const deletedRows = await Contract.destroy({ where: { id } });

    if (deletedRows === 0)
      throw new ResourceNotFound(
        id,
        "Contract",
        "ContractController",
        "remove"
      );

    return true;
  } catch (error) {
    console.error(error);
    throw new InternalError(error);
  }
};

const find = async (date) => {
  const localQuery = { ...findQuery };

  try {
    if (date) localQuery.where = { date };

    const dbContracts = await Contract.findAll(localQuery);

    return dbContracts.length ? dbContracts : null;
  } catch (error) {
    console.error(error);
    throw new InternalError(error);
  }
};

const findById = async (id) => {
  try {
    const dbContract = await Contract.findByPk(id, findQuery);

    return dbContract;
  } catch (error) {
    console.error(error);
    throw new InternalError(error);
  }
};

const findBySupplier = async (SupplierId) => {
  const localQuery = { where: { SupplierId }, ...findQuery };

  try {
    const dbContracts = await Contract.findAll(localQuery);

    return dbContracts.length ? dbContracts : null;
  } catch (error) {
    console.error(error);
    throw new InternalError(error);
  }
};

const findByUser = async (UserId) => {
  const localQuery = { where: { UserId }, ...findQuery };

  try {
    const dbContracts = await Contract.findAll(localQuery);

    return dbContracts.length ? dbContracts : null;
  } catch (error) {
    console.error(error);
    throw new InternalError(error);
  }
};

module.exports = {
  add,
  update,
  remove,
  findById,
  findBySupplier,
  findByUser,
  find,
};
