const Chat = require("../models/chat-table");
const Archive = require("../models/archive-table");
const sequelize = require("../utils/database");
const { CronJob } = require("cron");

exports.job = new CronJob(
  "0 36 3 * * *",
  async () => {
    const t = await sequelize.transaction();

    try {
      const data = await Chat.findAll();


      const archiveData = data.map((element) => ({
        groupId: element.groupid,
        message: element.message,
        name: element.name,
        userId: element.userId,
        type: element.type,
      }));

      await Archive.bulkCreate(archiveData, { transaction: t });

      await Chat.destroy({ where: {} }, { transaction: t });

      await t.commit();
    } catch (err) {
      await t.rollback();
      console.log(err);
    }
  },
  null,
  true
);
