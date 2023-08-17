const Admin = require("../models/admin-table");
const Group = require("../models/group-table");
const User = require("../models/user-table");
const UserGroup = require("../models/usergroup-table");
const sequelize = require("../utils/database");

exports.createGroup = async (req, res, next) => {
  const { grpname, description } = await req.body;

  // console.log(message);
  // console.log(req.user.id);

  if (!grpname || !description) {
    return res.status(400).json({
      error: "Group and Description are required fields!",
    });
  }

  const t = await sequelize.transaction();

  try {
    const addGroup = await Group.create(
      {
        grpname: grpname,
        description: description,
        email: req.user.email,
        adminuserId: req.user.id,
      },
      { transaction: t }
    );
    // console.log(addGroup.id)

    // await addGroup.addUser(req.user.id);

    const adduserTogroup = await UserGroup.create(
      {
        groupId: addGroup.id,
        userId: req.user.id,
      },
      {
        transaction: t,
      }
    );
    // console.log(adduserTogroup);

    const makeAdmin = await Admin.create(
      {
        groupId: addGroup.id,
        userId: req.user.id,
      },
      {
        transaction: t,
      }
    );
    // console.log(makeAdmin);

    await t.commit();

    res.status(201).json({
      message: "Group added successfully!",
      data: { addGroup },
    });
  } catch (err) {
    // console.log(err);
    await t.rollback();
    return res.status(400).json({ error: "Error while adding Group" });
  }
};

exports.fetchGroup = async (req, res, next) => {
  const userId = req.user.id;

  // console.log(req.user.id);

  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Group,
          attributes: ["id", "grpname", "description"],
        },
      ],
      transaction: t,
    });

    // console.log(user);

    if (user) {
      const groups = user.groups;

      // console.log(groups);

      await t.commit();

      res
        .status(200)
        .json({ message: "Group Fetched successfully!", data: { groups } });
    } else {
      res.status(401).json({ message: "No groups Found!" });
    }
  } catch (err) {
    // console.log(err);
    await t.rollback();
    return res.status(404).json({ message: "Unable to Fetch groups!" });
  }
};

exports.adduserTogroup = async (req, res, next) => {
  const { groupId, userId } = await req.body;

  // console.log(groupId, userId, req.user.id);

  if (!groupId || !userId) {
    return res.status(400).json({
      error: "Username and Groupname are required fields!",
    });
  }

  const t = await sequelize.transaction();

  try {
    const isAdmin = await Admin.findOne({
      where: {
        userId: req.user.id,
        groupId: groupId,
      },
      transaction: t,
    });
    // console.log(isAdmin);

    if (isAdmin) {
      const adduserTogroup = await UserGroup.create(
        {
          groupId: groupId,
          userId: userId,
        },
        { transaction: t }
      );

      // console.log(adduserTogroup);
      await t.commit();

      return res.status(201).json({
        message: "User added in group added successfully!",
        data: { adduserTogroup },
      });
    } else {
      return res.status(404).json({
        message: "Not group admin!",
        data: { adduserTogroup },
      });
    }
  } catch (err) {
    // console.log(err);
    await t.rollback();
    return res.status(400).json({ error: "Not group admin!" });
  }
};

exports.removeUserfromgroup = async (req, res, next) => {
  const { groupId, userId } = await req.body;

  // console.log(groupId, userId, req.user.id);

  if (!groupId || !userId) {
    return res.status(400).json({
      error: "Username and Groupname are required fields!",
    });
  }

  const t = await sequelize.transaction();

  try {
    const isAdmin = await Admin.findOne({
      where: {
        userId: req.user.id,
        groupId: groupId,
      },
      transaction: t,
    });
    // console.log(isAdmin);

    if (isAdmin) {
      const adduserTogroup = await UserGroup.destroy({
        where: {
          groupId: groupId,
          userId: userId,
        },
        transaction: t,
      });

      // console.log(adduserTogroup);

      await t.commit();

      return res.status(201).json({
        message: "User removed from group successfully!",
      });
    } else {
      return res.status(404).json({
        message: "Not a group admin!",
      });
    }
  } catch (err) {
    // console.log(err);

    await t.rollback();
    return res.status(400).json({ error: "Not a group admin!" });
  }
};

exports.adminOfgroup = async (req, res, next) => {
  const { groupId, userId } = await req.body;

  console.log(groupId, userId, req.user.id);

  if (!groupId || !userId) {
    return res.status(400).json({
      error: "Username and Groupname are required fields!",
    });
  }

  const t = await sequelize.transaction();

  try {
    const isAdmin = await Admin.findOne({
      where: {
        userId: req.user.id,
        groupId: groupId,
      },
      transaction: t,
    });

    // console.log(isAdmin);

    if (isAdmin) {
      const makeAdmin = await Admin.create(
        {
          groupId: groupId,
          userId: userId,
        },
        { transaction: t }
      );

      // console.log(makeAdmin);

      await t.commit();

      res.status(201).json({
        message: "Admin created successfully!",
        data: { makeAdmin },
      });
    } else {
      res.status(404).json({
        message: "Invalid admin!",
      });
    }
  } catch (err) {
    console.log(err);

    await t.rollback();
    return res.status(400).json({ error: "Unable to make admin!" });
  }
};
