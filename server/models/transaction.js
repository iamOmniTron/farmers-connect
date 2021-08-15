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
      allowNull:false
    })
    Transaction.belongsToMany(models.Product,{
      through:"Sale"
    })

  }
  return Transaction;
};