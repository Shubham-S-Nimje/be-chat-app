const Chat = require("../models/chat-table");

exports.addChat = async (req, res, next) => {
  const { message, email } = await req.body;

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
      userId: req.user.id,
    });
    // console.log(addChat)

    res.status(201).json({
      message: "Chat added successfully!",
      data: addChat,
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ error: "Error while adding chat" });
  }
};

exports.fetchChat = async (req, res, next) => {
  try {
    const chats = await Chat.findAll();

    if (chats) {
      res
        .status(200)
        .json({ message: "Chats Fetched successfully!", data: { chats } });
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
