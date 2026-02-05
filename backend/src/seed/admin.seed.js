require("dotenv").config();
const bcrypt = require("bcryptjs");

const sequelize = require("../config/db");
const User = require("../models/user.model");

(async () => {
  try {
    // Connect to DB
    await sequelize.authenticate();

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: "admin@hospital.com" }
    });

    if (existingAdmin) {
      console.log("Admin already exists. Skipping seed.");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create admin
    await User.create({
      name: "Super Admin",
      email: "admin@hospital.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "APPROVED"
    });

    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error);
    process.exit(1);
  }
})();
