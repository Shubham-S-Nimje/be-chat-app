const Chat = require("../models/chat-table");
const { Op } = require("sequelize");
const sequelize = require("../utils/database");
const uploadToS3 = require("../services/s3services");
const multer = require("multer");

exports.addChat = async (req, res, next) => {
  const { message, activegrpid, activeuserid } = await req.body;

  console.log(message);
  console.log(req.user.id);

  if (!message) {
    return res.status(400).json({
      error: "Message required fields!",
    });
  }

  const t = await sequelize.transaction();

  try {
    const addChat = await Chat.create(
      {
        message: message,
        username: req.user.username,
        email: req.user.email,
        groupId: activegrpid,
        userId: req.user.id,
        touserId: activeuserid,
      }
      // { transaction: t }
    );
    console.log(addChat);

    res.status(201).json({
      message: "Chat added successfully!",
      data: { addChat },
    });
  } catch (err) {
    console.log(err);
    // await t.rollback();
    return res.status(400).json({ error: "Error while adding chat" });
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

exports.addFile = async (req, res, next) => {
  upload(req, res, async (error) => {
    if (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Error uploading file" });
    }

    const fileData = req.file;
    console.log(fileData);

    if (!fileData) {
      return res.status(400).json({
        error: "File not found!",
      });
    }

    const { activegrpid, activeuserid } = req.body;
    console.log(activegrpid, activeuserid);

    const filename = `${req.user.id}/${new Date().toISOString()}/${
      fileData.originalname
    }`;

    const fileUrl = await uploadToS3(fileData.buffer, filename);

    console.log(fileUrl);

    const t = await sequelize.transaction();

    console.log(
      fileUrl,
      req.user.username,
      req.user.email,
      +activegrpid,
      req.user.id,
      +activeuserid
    );

    try {
      const addfile = await Chat.create(
        {
          message: fileUrl,
          username: req.user.username,
          email: req.user.email,
          groupId: activegrpid === "null" ? null : +activegrpid,
          userId: req.user.id,
          touserId: activeuserid === "null" ? null : +activeuserid,
        }
        // { transaction: t }
      );
      console.log(addfile);

      // await t.commit();

      return res
        .status(200)
        .json({ message: "File uploaded successfully.", data: { addfile } });
    } catch (error) {
      // await t.rollback();
      console.log(error);
      return res.status(400).json({ error: "Unable to upload file." });
    }
  });
};

exports.fetchChat = async (req, res, next) => {
  const idlist = req.query.id;
  // console.log(req.query.id)

  // let lastchatid;
  // if (+idlist[1] > 5) {
  //   lastchatid = +idlist[1] - 5;
  //   // console.log(lastchatid)
  // } else {
  //   lastchatid = 0;
  // }
  const activeGrpid = +idlist[0];
  const messageLimit = +idlist[1];
  const activeuserid = +idlist[2];

  // console.log(
  //   "messageLimit",
  //   messageLimit,
  //   "activeGrpid",
  //   activeGrpid,
  //   "activeuserid",
  //   activeuserid
  // );

  const t = await sequelize.transaction();

  try {
    let chats;
    if (activeGrpid) {
      // chats = [];
      chats = await Chat.findAll({
        where: {
          groupId: activeGrpid,
        },
        order: [["createdAt", "DESC"]],
        limit: messageLimit,
        transaction: t,
      });
      // console.log(chats);
    }

    if (activeuserid) {
      // chats = [];
      chats = await Chat.findAll({
        where: {
          [Op.or]: [
            {
              userId: req.user.id,
              touserId: activeuserid,
            },
            {
              userId: activeuserid,
              touserId: req.user.id,
            },
          ],
        },
        order: [["createdAt", "DESC"]],
        limit: messageLimit,
        transaction: t,
      });
      // console.log(chats);
    }

    await t.commit();

    if (chats) {
      // console.log(chats.length);
      chats.sort((a, b) => a.createdAt - b.createdAt);

      if (chats.length === 0) {
        console.log("No chats found!");
        res.status(200).json({ message: "Nochats found!", data: { chats } });
      } else if (messageLimit > chats.length + 5) {
        console.log("Everything is up to date!");
        res.status(404).json({ message: "Everything is up to date!" });
      } else {
        console.log("Chats Fetched successfully!");
        res
          .status(200)
          .json({ message: "Chats Fetched successfully!", data: { chats } });
      }
    } else {
      console.log("No chats Found!");
      res.status(401).json({ message: "No chats Found!" });
    }
  } catch (err) {
    console.log(err);
    await t.rollback();

    return res
      .status(404)
      .json({ message: "Unable to Fetch chats!", error: err });
  }
};
