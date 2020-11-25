'use strict';
module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    name: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true
    }
  }, {});
  State.associate = function(models) {
    State.belongsToMany(models.Park, {
      through: "Locations",
      foreignKey: "stateId",
      otherKey: "parkId"
    })
  };
  return State;
};
