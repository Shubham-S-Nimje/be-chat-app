const User = require("../models/user-table");

exports.addUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  //   console.log(username, email, password);

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Email And Password are required fields!" });
  }

  try {
    const createuser = await User.create({
      username: username,
      email: email,
      password: password,
    });

    // console.log(createuser)

    res.status(201).json({
      message: "Account created successfully!",
      data: createuser,
    });
  } catch (err) {
    //   console.log(err);

    return res
      .status(400)
      .json({ message: "Unable to Create Account!", error: err });
  }
  //   return res.status(400).json({ error: "Error While Creating Account!" });
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

//   console.log(email, password);

  try {
    const createuser = await User.findAll({
      where: { email: email },
    });
    // console.log(createuser[0].password)
    if (createuser) {
      if (createuser[0].password == password) {
        // console.log('true')

        res.status(200).json({ message: "Login successfull!", user: createuser });
      } else {
        //   console.log("false");
        console.log("Password incorrect");
        res.status(401).json({ message: "Password incorrect!" });
      }
    } else {
      //   console.log("false");
      console.log("User not found");
      res.status(401).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);

    return res.status(400).json({ message: "Unable to Login!", error: err });
  }
  //   return res.status(400).json({ error: "Error While Creating Account!" });
};
