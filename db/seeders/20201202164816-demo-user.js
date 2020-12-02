'use strict';

const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("password123", 12);
    return queryInterface.bulkInsert('Users', [{
     username: "DemoUser",
     email: "DemoUser@NatlRoutes.com",
     password: hashedPassword,
     createdAt: new Date(),
     updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
