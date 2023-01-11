const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {

  sequelize.define('Supplier', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cuit: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.TEXT,
      defaultValue: 'https://res.cloudinary.com/dx2ea2zze/image/upload/v1671883621/bg5qffuqhddslxp7hkdg.png'
    },
    isAuthorized: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 8
    }
  },
  {
    timestamps: false
  });
};