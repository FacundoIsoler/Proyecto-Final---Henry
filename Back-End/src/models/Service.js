const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Service",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      serviceType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pricePerHour: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      representative_image: {
        type: DataTypes.TEXT,
        defaultValue:
          "https://www.shutterstock.com/image-photo/work-tools-on-wooden-background-260nw-1513549190.jpg",
      },
      disponible:{
        type: DataTypes.BOOLEAN,
        defaultValue:true
      },
      amount: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    },
    {
      timestamps: false,
    }
  );
};
