const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// CREATE STAFF (PENDING)
exports.createStaff = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role === "PATIENT" || role === "ADMIN") {
    return res.status(400).json({ message: "Invalid staff role" });
  }

  // ✅ FIXED HERE
  const exists = await User.findOne({
    where: { email }
  });

  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashed,
    role,
    status: "PENDING"
  });

  res.status(201).json({ message: "Staff created. Awaiting approval." });
};

// GET PENDING USERS
exports.getPendingUsers = async (req, res) => {
  const users = await User.findAll({
    where: { status: "PENDING" },
    attributes: { exclude: ["password"] }
  });

  res.json(users);
};

// APPROVE USER
exports.approveUser = async (req, res) => {
  const { userId } = req.params;

  await User.update(
    { status: "APPROVED" },
    { where: { id: userId } }
  );

  res.json({ message: "User approved" });
};
