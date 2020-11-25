'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RoutesParks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      routeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: 'Routes'}
      },
      parkId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: 'Parks'}
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RoutesParks');
  }
};
