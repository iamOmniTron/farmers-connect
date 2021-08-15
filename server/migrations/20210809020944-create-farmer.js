'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Farmer', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'User',
          key: 'id',
          as: 'userId',
        },
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Farmer');
  }
};