const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Contract", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "CREADA",
    },
  });
};
