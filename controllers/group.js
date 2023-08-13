const Group = require("../models/group-table");
const User = require("../models/user-table");
const UserGroup = require("../models/usergroup-table");

exports.createGroup = async (req, res, next) => {
  const { grpname, description } = await req.body;

  // console.log(message);
  // console.log(req.user.id);

  if (!grpname || !description) {
    return res.status(400).json({
      error: "Group and Description are required fields!",
    });
  }

  try {
    const addGroup = await Group.create({
      grpname: grpname,
      description: description,
      email: req.user.email,
      adminuserId: req.user.id,
    });
    // console.log(addGroup.id)

    // await addGroup.addUser(req.user.id);

    const adduserTogroup = await UserGroup.create({
      groupId: addGroup.id,
      userId: req.user.id,
    });
    // console.log(adduserTogroup);

    res.status(201).json({
      message: "Group added successfully!",
      data: { addGroup },
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ error: "Error while adding Group" });
  }
};

exports.fetchGroup = async (req, res, next) => {
  const userId = req.user.id;

  // console.log(req.user.id);

  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Group,
          attributes: ["id", "grpname", "description"],
        },
      ],
    });

    console.log(user);

    if (user) {
      const groups = user.groups;

      // console.log(groups);

      res
        .status(200)
        .json({ message: "Group Fetched successfully!", data: { groups } });
    } else {
      res.status(401).json({ message: "No groups Found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Unable to Fetch groups!" });
  }
};

exports.adduserTogroup = async (req, res, next) => {
  const { groupId, userId } = await req.body;

  // console.log(groupId, userId);

  if (!groupId || !userId) {
    return res.status(400).json({
      error: "Username and Groupname are required fields!",
    });
  }

  try {
    const adduserTogroup = await UserGroup.create({
      groupId: groupId,
      userId: userId,
    });
    console.log(adduserTogroup);

    res.status(201).json({
      message: "User added in group added successfully!",
      data: { adduserTogroup },
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({ error: "Error while adding user in group" });
  }
};
