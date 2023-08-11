const User = require("../models/user-table");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const { JWT_SECRET } = dotenv.parsed;

// console.log(JWT_SECRET)

exports.addUser = async (req, res, next) => {
  const { username, email, password, phonenumber } = req.body;

  //   console.log(username, email, password);

  if (!username || !email || !password || !phonenumber) {
    return res
      .status(400)
      .json({ error: "Email And Password are required fields!" });
  }

  const salt = await bcrypt.genSalt(10);
  const secretpass = await bcrypt.hash(password, salt);

  try {
    const createuser = await User.create({
      username: username,
      email: email,
      password: secretpass,
      phonenumber: phonenumber,
    });

    // console.log(createuser)

    const data = {
      user: {
        id: createuser.id,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    // console.log(jwtdata)

    res.status(201).json({
      message: "Account created successfully!",
      data: { authToken },
    });
  } catch (err) {
    //   console.log(err);

    return res.status(400).json({ error: err });
  }
  //   return res.status(400).json({ error: "Error While Creating Account!" });
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  //   console.log(email, password);

  try {
    const user = await User.findAll({
      where: { email: email },
    });
    // console.log(user[0].id);

    if (user) {
      bcrypt.compare(password, user[0].password, function (err, result) {
        if (result) {
          const data = {
            user: {
              id: user[0].id,
            },
          };

          const authToken = jwt.sign(data, JWT_SECRET);

          res
            .status(200)
            .json({ message: "Login successfull!", user: { authToken } });
        } else {
          console.log("Password is incorrect");
          res.status(401).json({ message: "Password is incorrect!" });
        }
      });
    } else {
      //   console.log("false");
      console.log("Email is incorrect");
      res.status(401).json({ message: "Email is incorrect!" });
    }
  } catch (err) {
    console.log(err);

    return res.status(404).json({ message: "Unable to Login!", error: err });
  }
};

exports.fetchUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    if (users) {
      res
        .status(200)
        .json({ message: "Users Fetched successfully!", users: { users } });
    } else {
      //   console.log("No Users Found!");
      res.status(401).json({ message: "No Users Found!" });
    }
  } catch (err) {
    // console.log(err);

    return res
      .status(404)
      .json({ message: "Unable to Fetch Users!", error: err });
  }
};
