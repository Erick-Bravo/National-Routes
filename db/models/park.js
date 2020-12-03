'use strict';
module.exports = (sequelize, DataTypes) => {
  const Park = sequelize.define('Park', {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT
  }, {});
  Park.associate = function(models) {
    Park.belongsToMany(models.State, {
      through: "Locations",
      otherKey: "stateId",
      foreignKey: "parkId"
    });

    Park.belongsToMany(models.User, {
      through: 'Visited',
      otherKey: 'userId',
      foreignKey: 'parkId'
    });

    Park.belongsToMany(models.Route,{
      through: 'RoutesParks',
      otherKey: 'routeId',
      foreignKey: 'parkId'
    });

    Park.hasMany(models.Visited,{
      foreignKey: 'parkId'
    });
  };
  return Park;
};
