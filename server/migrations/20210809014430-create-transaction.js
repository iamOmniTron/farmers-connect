'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transaction', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4,
        primaryKey: true,
      },
      price: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      buyerId: {
        type: Sequelize.UUID,
        onDelete: 'RESTRICT',
        references: {
          model: 'Users',
          key: 'id',
          as: 'buyerId',
        },
      },
      productId: {
        type: Sequelize.UUID,
        references: {
          model: 'Product',
          key: 'id',
          as: 'productId',
        },
      },
      storeId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Store',
          key: 'id',
          as: 'storeId',
        },
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Transaction');
  }
};