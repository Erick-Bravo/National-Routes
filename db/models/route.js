'use strict';
module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Route.associate = function(models) {
    Route.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Route.belongsToMany(models.Park,{
      through: 'RoutesParks',
      foreignKey: 'routeId',
      otherKey: 'parkId'
    });
  };
  return Route;
};
