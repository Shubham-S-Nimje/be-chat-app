const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
router.post("/add-user", userController.addUser);
router.post("/login-user", userController.loginUser);

module.exports = router;
