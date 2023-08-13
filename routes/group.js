const express = require("express");
const router = express.Router();

const groupController = require("../controllers/group");
const authenticateUser = require("../middleware/auth");

router.post("/create-group", authenticateUser, groupController.createGroup);

router.post("/adduser-togroup", authenticateUser, groupController.adduserTogroup);

router.get("/fetch-groups", authenticateUser, groupController.fetchGroup);


module.exports = router;