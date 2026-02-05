const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const {
  createStaff,
  getPendingUsers,
  approveUser
} = require("../controllers/admin.controller");

router.post("/create-staff", auth, role("ADMIN"), createStaff);
router.get("/pending-users", auth, role("ADMIN"), getPendingUsers);
router.put("/approve/:userId", auth, role("ADMIN"), approveUser);

module.exports = router;
