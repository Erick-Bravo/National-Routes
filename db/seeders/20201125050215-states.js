'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('States', [
    {name: "Alabama", createdAt: new Date(), updatedAt: new Date()},
    {name: "Alaska", createdAt: new Date(), updatedAt: new Date()},
    {name: "Arizona", createdAt: new Date(), updatedAt: new Date()},
    {name: "Arkansas", createdAt: new Date(), updatedAt: new Date()},
    {name: "California", createdAt: new Date(), updatedAt: new Date()},
    {name: "Colorado", createdAt: new Date(), updatedAt: new Date()},
    {name: "Connecticut", createdAt: new Date(), updatedAt: new Date()},
    {name: "Delaware", createdAt: new Date(), updatedAt: new Date()},
    {name: "Florida", createdAt: new Date(), updatedAt: new Date()},
    {name: "Georgia", createdAt: new Date(), updatedAt: new Date()},
    {name: "Hawaii", createdAt: new Date(), updatedAt: new Date()},
    {name: "Idaho", createdAt: new Date(), updatedAt: new Date()},
    {name: "Illinois", createdAt: new Date(), updatedAt: new Date()},
    {name: "Indiana", createdAt: new Date(), updatedAt: new Date()},
    {name: "Iowa", createdAt: new Date(), updatedAt: new Date()},
    {name: "Kansas", createdAt: new Date(), updatedAt: new Date()},
    {name: "Kentucky", createdAt: new Date(), updatedAt: new Date()},
    {name: "Louisiana", createdAt: new Date(), updatedAt: new Date()},
    {name: "Maine", createdAt: new Date(), updatedAt: new Date()},
    {name: "Maryland", createdAt: new Date(), updatedAt: new Date()},
    {name: "Massachusetts", createdAt: new Date(), updatedAt: new Date()},
    {name: "Michigan", createdAt: new Date(), updatedAt: new Date()},
    {name: "Minnesota", createdAt: new Date(), updatedAt: new Date()},
    {name: "Mississippi", createdAt: new Date(), updatedAt: new Date()},
    {name: "Missouri", createdAt: new Date(), updatedAt: new Date()},
    {name: "Montana", createdAt: new Date(), updatedAt: new Date()},
    {name: "Nebraska", createdAt: new Date(), updatedAt: new Date()},
    {name: "Nevada", createdAt: new Date(), updatedAt: new Date()},
    {name: "New Hampshire", createdAt: new Date(), updatedAt: new Date()},
    {name: "New Jersey", createdAt: new Date(), updatedAt: new Date()},
    {name: "New Mexico", createdAt: new Date(), updatedAt: new Date()},
    {name: "New York", createdAt: new Date(), updatedAt: new Date()},
    {name: "North Carolina", createdAt: new Date(), updatedAt: new Date()},
    {name: "North Dakota", createdAt: new Date(), updatedAt: new Date()},
    {name: "Ohio", createdAt: new Date(), updatedAt: new Date()},
    {name: "Oklahoma", createdAt: new Date(), updatedAt: new Date()},
    {name: "Oregon", createdAt: new Date(), updatedAt: new Date()},
    {name: "Pennsylvania", createdAt: new Date(), updatedAt: new Date()},
    {name: "Rhode Island", createdAt: new Date(), updatedAt: new Date()},
    {name: "South Carolina", createdAt: new Date(), updatedAt: new Date()},
    {name: "South Dakota", createdAt: new Date(), updatedAt: new Date()},
    {name: "Tennessee", createdAt: new Date(), updatedAt: new Date()},
    {name: "Texas", createdAt: new Date(), updatedAt: new Date()},
    {name: "Utah", createdAt: new Date(), updatedAt: new Date()},
    {name: "Vermont", createdAt: new Date(), updatedAt: new Date()},
    {name: "Virginia", createdAt: new Date(), updatedAt: new Date()},
    {name: "Washington", createdAt: new Date(), updatedAt: new Date()},
    {name: "West Virginia", createdAt: new Date(), updatedAt: new Date()},
    {name: "Wisconsin", createdAt: new Date(), updatedAt: new Date()},
    {name: "Wyoming", createdAt: new Date(), updatedAt: new Date()},
    {name: 'American Samoa', createdAt: new Date(), updatedAt: new Date()},
    {name: 'U.S. Virgin Islands', createdAt: new Date(), updatedAt: new Date()}
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('States', null, {});
  }
};
