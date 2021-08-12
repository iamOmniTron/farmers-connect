'use strict';
module.exports = (sequelize, DataTypes) => {
 const Product = sequelize.define("Product",{
   id:{
     type:DataTypes.UUID,
     defaultValue:DataTypes.UUIDV4,
     primaryKey:true
   },
   name:{
     type:DataTypes.STRING,
     allowNull:false
   },
   imageUrl:{
    type:DataTypes.STRING
   },
   price:{
     type:DataTypes.INTEGER,
    allowNull:false
   },
   isBought:{
     type:DataTypes.BOOLEAN,
     defaultValue:false
   },
   description:{
     type:DataTypes.STRING,
     allowNull:false
   }
 },{
   freezeTableName:true
 });
 Product.associate = (models)=>{
   Product.belongsTo(models.Store,{
     foreignKey:{
       allowNull:false
     }, 
     onDelete:"CASCADE"
   });
   Product.hasOne(models.Transaction,{
     foreignKey:{
       allowNull:false
     },
   })
 }
  return Product;
};