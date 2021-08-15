'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
      },
      storeId:{
        type:Sequelize.UUID,
        onDelete:"CASCADE",
        references:{
          model:"Store",
          key:"id",
          as:"storeId"
        },
        buyerId:{
          type:Sequelize.UUID,
          reference:{
            model:"User",
            key:"id",
            as:"buyerId"
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  }
};