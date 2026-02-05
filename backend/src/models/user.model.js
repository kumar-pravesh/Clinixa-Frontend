const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: {
    type: DataTypes.ENUM(
      "ADMIN",
      "DOCTOR",
      "PATIENT",
      "LAB_TECHNICIAN",
      "RECEPTIONIST"
    ),
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM("PENDING", "APPROVED"),
    defaultValue: "PENDING"
  }
});

module.exports = User;
