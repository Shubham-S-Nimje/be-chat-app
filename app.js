const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const sequelize = require("./utils/database");
const morgan = require("morgan");
const fs = require('fs')
const path = require("path");

const authRoutes = require("./routes/auth");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", authRoutes);

sequelize
  .sync()
  .then((results) => {
    // console.log(results);
  })
  .catch((error) => console.log(error));

app.listen(process.env.PORT || "4000");
