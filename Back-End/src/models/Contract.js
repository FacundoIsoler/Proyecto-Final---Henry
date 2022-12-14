const { DataTypes, NOW } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Contract", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      default: NOW,
    },
    status: {
      type: DataTypes.STRING,
      default: "CREADA",
    },
  });
};
