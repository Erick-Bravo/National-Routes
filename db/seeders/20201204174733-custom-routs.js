'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Routes', [
      {name: 'Want to go', userId: 1, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Next summer', userId: 1, createdAt: new Date(), updatedAt: new Date()}
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Rotes', null, {});
  }
};
