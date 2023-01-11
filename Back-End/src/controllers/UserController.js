const { User, UserRol } = require("../db");
const { UniqueConstraintError } = require("sequelize");
const { DuplicatedRecord } = require("../errors");

const add = async (
  { name, nickname, given_name, family_name, picture, email, email_verified },
  user_role = "User"
) => {
  try {
    let dbUserRol = await UserRol.findOne({ where: { name: user_role } });
    // se mando un rol inexistente, buscamos el rol user
    if (!dbUserRol)
      dbUserRol = await UserRol.findOne({ where: { name: "User" } });

    return await User.create({
      name,
      nickname,
      given_name,
      family_name,
      picture,
      email,
      email_verified,
      UserRolId: dbUserRol.id,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    return await User.findByPk(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserRole = async (id) => {
  try {
    const user = await User.findByPk(id, {
      include: { model: UserRol, attributes: ["name"] },
    });
    return user.UserRol.name;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const setUserRole = async (id, user_role) => {
  try {
    let dbUserRol = await UserRol.findOne({ where: { name: user_role } });
    // se mando un rol inexistente, buscamos el rol user
    if (!dbUserRol)
      dbUserRol = await UserRol.findOne({ where: { name: "User" } });

    const user = await User.update(
      { UserRolId: dbUserRol.id },
      { where: { id } }
    );

    return user;
  } catch (error) {
    // personalizamos el error
    if (error.name === "SequelizeForeignKeyConstraintError") {
      // si llegamos aca es porque pusieron un rol inexistente
      // mandamos un error personalizado al route handler
      const err = new Error();
      err.message = `No se encontró el rol "${user_role}"`;
      err.name = "UserRoleNotFound";

      throw err;
    }

    // error no definido, mandamos al route handler tal como vino
    console.error(error);
    throw error;
  }
};

const update = async (
  id,
  { name, nickname, given_name, family_name, picture, email, email_verified }
) => {
  try {
    const user = await User.update(
      {
        name,
        nickname,
        given_name,
        family_name,
        picture,
        email, // tengo dudas si modificar esto
        email_verified,
      },
      { where: { id } }
    );

    return await findById(id);
  } catch (error) {
    // si es uniqueconstraint quiere poner un mail ya usado
    if (error instanceof UniqueConstraintError)
      throw new DuplicatedRecord(email, "User", "UserController", "update");

    console.error(error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const deletedRows = await User.destroy({ where: { id } });

    return deletedRows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  add,
  findByEmail,
  findById,
  getUserRole,
  setUserRole,
  update,
  remove,
};
