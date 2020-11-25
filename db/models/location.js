'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parkId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Location.associate = function(models) {
    // associations can be defined here
  };
  return Location;
};
