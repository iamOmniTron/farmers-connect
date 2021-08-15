'use strict';
module.exports = (sequelize, DataTypes) => {
 const Store = sequelize.define("Store",{
   id:{
     type:DataTypes.UUID,
     defaultValue:DataTypes.UUIDV4,
     primaryKey:true
   },
   name:{
     type:DataTypes.STRING,
     allowNull:false
   },
 },{
   freezeTableName:true
 });
 Store.associate = (models)=>{
   Store.hasMany(models.Product,{
     foreignKey:{
       allowNull:false
     },
   });
   Store.belongsTo(models.Farmer,{
     foreignKey:{
       name:"ownerId",
       allowNull:false
     },
     onDelete:"CASCADE"
   })
   Store.hasMany(models.Order,{
     foreignKey:{
      allowNull:false,
     },
     onDelete:"CASCADE"
   })
 }
  return Store;
};