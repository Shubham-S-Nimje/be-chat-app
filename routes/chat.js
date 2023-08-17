const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat");
const authenticateUser = require("../middleware/auth");

router.post("/add-chat", authenticateUser, chatController.addChat);

router.post("/add-image", authenticateUser, chatController.addFile);

router.get("/fetch-chats/:id", authenticateUser, chatController.fetchChat);

module.exports = router;