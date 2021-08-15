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
      total: {
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
          model: 'User',
          key: 'id',
          as: 'buyerId',
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