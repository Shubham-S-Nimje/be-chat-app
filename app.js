const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const sequelize = require("./utils/database");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const http = require("http");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/group");
const User = require("./models/user-table");
const Chat = require("./models/chat-table");
const Group = require("./models/group-table");
const UserGroup = require("./models/usergroup-table");
const Admin = require("./models/admin-table");
const { Server } = require("socket.io");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", authRoutes);

app.use("/chat", chatRoutes);

app.use("/group", groupRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // socket.on("join-personalchat", (data) => {
  //   socket.join(data);
  //   console.log("Join personal chat user id:", socket.id);
  // });

  // socket.on("join-groupchat", (data) => {
  //   socket.join(data);
  //   console.log("Join group chat user id:", socket.id);
  // });

  socket.on("message", (data) => {
    // socket.join(data);
    // console.log(data)
    console.log("Active chats user id:", socket.id);
    io.emit("active-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Admin);
Admin.belongsTo(Group);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

sequelize
  // .sync({ force: true })
  .sync()
  .then((results) => {
    // console.log(results);
    server.listen(process.env.PORT || "4000");
  })
  .catch((error) => console.log(error));
