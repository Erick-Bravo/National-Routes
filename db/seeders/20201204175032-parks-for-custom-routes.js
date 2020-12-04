'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('RoutesParks', [
      {routeId: 1, parkId: 61, createdAt: new Date(), updatedAt: new Date()},
      {routeId: 1, parkId: 55, createdAt: new Date(), updatedAt: new Date()},
      {routeId: 1, parkId: 31, createdAt: new Date(), updatedAt: new Date()}
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('RoutesParks', null, {});
  }
};
