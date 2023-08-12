const Chat = require("../models/chat-table");
const { Op } = require("sequelize");

exports.addChat = async (req, res, next) => {
  const { message } = await req.body;

  // console.log(message);
  // console.log(req.user.id);

  if (!message) {
    return res.status(400).json({
      error: "Message required fields!",
    });
  }

  try {
    const addChat = await Chat.create({
      message: message,
      username: req.user.username,
      email: req.user.email,
      userId: req.user.id,
    });
    // console.log(addChat)

    res.status(201).json({
      message: "Chat added successfully!",
      data: { addChat },
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ error: "Error while adding chat" });
  }
};

exports.fetchChat = async (req, res, next) => {
  const lastchatid = req.params.id - 5;

  console.log(req.params.id);

  try {
    const chats = await Chat.findAll({
      where: {
        id: {
          [Op.gt]: lastchatid,
        },
      },
    });
    // console.log(chats.length)

    if (chats) {
      if (lastchatid == chats.length) {
        // console.log("Everything is up to date!")
        res.status(200).json({ message: "Everything is up to date!" });
      } else {
        // console.log("Chats Fetched successfully!")
        res
          .status(200)
          .json({ message: "Chats Fetched successfully!", data: { chats } });
      }
    } else {
      //   console.log("No chats Found!");
      res.status(401).json({ message: "No chats Found!" });
    }
  } catch (err) {
    // console.log(err);

    return res
      .status(404)
      .json({ message: "Unable to Fetch chats!", error: err });
  }
};
