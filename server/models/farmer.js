'use strict';

module.exports = (sequelize, DataTypes) => {
  const Farmer = sequelize.define("Farmer",{
    id:{
      type:DataTypes.UUID,
      defaultvalue:DataTypes.UUIDV4,
      primaryKey:true
    }
  },{
    freezeTableName:true
  })
  Farmer.associate=(models)=>{
    Farmer.belongsTo(models.User,{
      onDelete:"CASCADE"
    });
    Farmer.hasOne(models.Store,{
      foreignKey:{
        name:"ownerId",
        allowNull:false
      },
      onDelete: "CASCADE"
    });
  }
  return Farmer;
};