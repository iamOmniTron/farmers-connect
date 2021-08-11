'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction",{
    id:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey:true
    },
    total:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
  },{
    freezeTableName:true
  });
  Transaction.associate = (models)=>{
    Transaction.belongsTo(models.User,{
      foreignKey:"buyerId"
    })
    Transaction.belongsTo(models.Product,{
      foreignKey:{
        allowNull:false
      }
    })
    Transaction.belongsTo(models.Store,{
      foreignKey:{
        allowNull:false
      },
      onDelete:"CASCADE"
    })
  }
  return Transaction;
};