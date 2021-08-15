'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order",{
    id:{
      type:DataTypes.UUID,
      primaryKey:true,
      defaultValue:DataTypes.UUIDV4,
    },
  },{
    freezeTableName:true
  })
  Order.associate = (models)=>{
    Order.belongsTo(models.Store,{
      foreignKey:{
        allowNull:false
      },
      onDelete:"CASCADE"
    })
    Order.belongsTo(models.User,{
      foreignKey:{
        allowNull:false
      },
      onDelete:"CASCADE"
    });
    Order.belongsToMany(models.Product,{
      through:"Sale",
    })
    }
  return Order;
};