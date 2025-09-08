const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const authController = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.put("/update-email/:userId", authController.updateEmail);
module.exports = router;
