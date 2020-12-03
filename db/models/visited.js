'use strict';
module.exports = (sequelize, DataTypes) => {
  const Visited = sequelize.define('Visited', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    parkId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        max: 5,
        min: 1
      }
    }
  }, {freezeTableName: true,});

  Visited.associate = function(models) {
    Visited.hasMany(models.Review, {
      foreignKey: 'visitedId'
    });

    Visited.belongsTo(models.User, {
      foreignKey: 'userId'
    });

    Visited.belongsTo(models.Park, {
      foreignKey: 'parkId'
    });
  };
  return Visited;
};
