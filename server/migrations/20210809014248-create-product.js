'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Product', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING
      },
      imageUrl:{
        type:Sequelize.STRING
      },
      price:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      isBought: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      description: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      StoreId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Store',
          key: 'id',
          as: 'StoreId',
        },
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Product');
  }
};