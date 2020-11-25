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
      throught: "Locations",
      otherKey: "stateId",
      foreignKey: "parkId"
    });

    Park.belongsToMany(models.User, {
      through: 'Visiteds',
      otherKey: 'userId',
      foreignKey: 'parkId'
    });

    Park.belongsToMany(model.Route,{
      through: 'RoutesParks',
      otherKey: 'routeId',
      foreignKey: 'parkId'
    });
  };
  return Park;
};
