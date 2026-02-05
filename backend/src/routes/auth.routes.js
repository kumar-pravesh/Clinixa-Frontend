const router = require("express").Router();
const { registerPatient, login } = require("../controllers/auth.controller");

router.post("/register-patient", registerPatient);
router.post("/login", login);

module.exports = router;
 