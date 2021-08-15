'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User",{
    id:{
      type:DataTypes.UUID,
      primaryKey:true,
      defaultValue:DataTypes.UUIDV4,
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false
    },
    phone:{
      type:DataTypes.STRING
    },
    password:{
      type: DataTypes.STRING,
      allowNull:false
    },
    role:{
      type:DataTypes.STRING,
    }
  },{
    freezeTableName:true
  })
  User.associate = (models)=>{
    User.hasOne(models.Farmer,{
      foreignKey:{
        allowNull:false
      }
    })
    User.hasMany(models.Transaction,{
      foreignKey:{
        allowNull:false
      },
      onDelete:"RESTRICT"
    })
    User.hasMany(models.Order)
  }
  return User;
};