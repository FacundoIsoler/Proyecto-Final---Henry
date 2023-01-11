const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Receipt", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.BIGINT,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    CP: {
        type: DataTypes.INTEGER,
    },
    preference_time:{
        type: DataTypes.STRING,
    }
});
};