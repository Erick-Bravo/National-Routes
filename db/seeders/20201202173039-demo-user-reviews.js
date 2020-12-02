'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [
      {visitedId: 1, text: "Beautiful, unique park with increadible rock formations.", createdAt: new Date(), updatedAt: new Date()},
      {visitedId: 2, text: "Not as many people as Grand Canyon, but it also not as spectacular. There is one great view spot with arch.", createdAt: new Date(), updatedAt: new Date()},
      {visitedId: 3, text: "So hot, so empty, so dead, yet there is some beauty in it... and Star Wars flashbacks. 😂", createdAt: new Date(), updatedAt: new Date()},
      {visitedId: 4, text: "Was excited to get there, but there were just too many people.", createdAt: new Date(), updatedAt: new Date()},
      {visitedId: 5, text: "Not very unique, they don't even charge to enter it.", createdAt: new Date(), updatedAt: new Date()},
      {visitedId: 6, text: "Nice park, but was there during government shutdown and it was a little trashed.", createdAt: new Date(), updatedAt: new Date()},
      {visitedId: 7, text: "This is one of my favourite parks of all, so many anymals and beautiful nature ❤", createdAt: new Date(), updatedAt: new Date()},
      {visitedId: 8, text: "It was hard to find parking spot and irritating being dependant on the bus. Also what the point of the park if you can't bring your dog with you?", createdAt: new Date(), updatedAt: new Date()},
      {visitedId: 8, text: "Still Zion is the most beautiful park I've seen!", createdAt: new Date(), updatedAt: new Date()},
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reviews', null, {});
  }
};
