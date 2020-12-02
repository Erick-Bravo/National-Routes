'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Visited', [
      {userId: 1, parkId: 3, rate: 4, createdAt:new Date(), updatedAt: new Date()},  //Arches
      {userId: 1, parkId: 9, rate: 3, createdAt:new Date(), updatedAt: new Date()},  //Canyonlands
      {userId: 1, parkId: 16, rate: 3, createdAt:new Date(), updatedAt: new Date()},  //Death Valley
      {userId: 1, parkId: 24, rate: 4, createdAt:new Date(), updatedAt: new Date()},  //Grand Canyon
      {userId: 1, parkId: 26, rate: 3, createdAt:new Date(), updatedAt: new Date()},  //Great Basin
      {userId: 1, parkId: 35, rate: 2, createdAt:new Date(), updatedAt: new Date()},  //Joshua Tree
      {userId: 1, parkId: 50, rate: 5, createdAt:new Date(), updatedAt: new Date()},  //Rocky Mountains
      {userId: 1, parkId: 62, rate: 5, createdAt:new Date(), updatedAt: new Date()},  //Zion
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Visited', null, {});
  }
};
