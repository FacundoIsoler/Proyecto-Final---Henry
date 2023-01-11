const {
  Detail,
  Contract,
  Review,
  Service,
  Supplier,
  Op,
  fn,
  conn,
} = require("../db");

const findQuery = {
  include: [
    { model: Review, attributes: [] },
    { model: Detail },
    { model: Contract, attributes: [] },
    {
      model: Service,
      attributes: [
        "serviceType",
        "pricePerHour",
        "description",
        "representative_image",
      ],
    },
  ],
};

const aggregationQuery = {
  attributes: {
    include: [
      [fn("COALESCE", fn("AVG", conn.col("Reviews.rating")), 0), "avgRating"],
      [fn("COUNT", conn.col("Reviews.rating")), "countRatings"],
      [fn("COUNT", conn.col("Contracts.id")), "countContracts"],
    ],
  },
  group: [
    "Supplier.id",
    "Detail.id",
    "Contracts.id",
    "Services.id",
    "Services->SupplierService.id",
  ],
};

const findByName = async (name, sort_by) => {
  const localQuery = { ...findQuery };
  try {
    if (name) localQuery.where = { name: { [Op.iLike]: `%${name}%` } };
    if (sort_by) {
      localQuery.order = [];
      for (const sort_param of sort_by.split(",")) {
        let field = sort_param;
        let sort_order = "+";

        if (["+", "-"].includes(sort_param.charAt(0)))
          [sort_order, field] = [sort_param.slice(0, 1), sort_param.slice(1)];

        // CHEQUEA QUE SEA UN PARAMETRO ORDENABLE
        if (
          !["name", "avgRating", "countRatings", "countContracts"].includes(
            field
          )
        )
          continue;

        localQuery.order.push([field, sort_order === "-" ? "DESC" : "ASC"]);
      }
    } else {
      localQuery.order = ["name"];
    }

    const dbSuppliers = await Supplier.findAll({
      ...localQuery,
      ...aggregationQuery,
    });

    return dbSuppliers.length ? dbSuppliers : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const dbSupplier = await Supplier.findByPk(id, {
      ...findQuery,
      ...aggregationQuery,
    });
    return dbSupplier;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const add = async ({
  name,
  cuit,
  description,
  logo,
  location,
  adress,
  phoneNumber,
  eMail,
}) => {
  try {
    const newSupplier = await Supplier.create(
      {
        name,
        cuit,
        description,
        logo,
        Detail: { location, adress, phoneNumber, eMail },
      },
      { include: [Detail] }
    );

    // retornamos asi para mantener el formato consistente
    return await findById(newSupplier.id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const update = async (
  id,
  { name, cuit, description, logo, location, adress, phoneNumber, eMail, isAuthorized }
) => {
  try {
    const updateSupplier = await Supplier.update(
      {
        name,
        cuit,
        description,
        logo,
        isAuthorized,
        Detail: { location, adress, phoneNumber, eMail },
      },
      { where: { id }, include: [Detail] }
    );

    // retornamos asi para mantener el formato consistente
    return await findById(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const deletedRows = await Supplier.destroy({ where: { id } });

    return deletedRows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  findByName,
  findById,
  add,
  update,
  remove,
};
