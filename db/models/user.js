'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING.BINARY,
      allowNull: false
    }
  },{});
  User.associate = function(models) {
    User.belongsToMany(models.Park, {
      through: 'Visited',
      foreignKey: 'userId',
      otherKey: 'parkId'
    });

    User.hasMany(models.Route, {
      foreignKey: 'userId'
    });

    User.hasMany(models.Visited, {
      foreignKey: 'userId'
    });
  };
  return User;
};
