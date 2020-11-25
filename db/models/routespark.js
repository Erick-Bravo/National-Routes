'use strict';
module.exports = (sequelize, DataTypes) => {
  const RoutesPark = sequelize.define('RoutesPark', {
    routeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parkId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  RoutesPark.associate = function(models) {
    // associations can be defined here
  };
  return RoutesPark;
};
