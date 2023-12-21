const models = require("../models");
const {Op} = require("sequelize")
const Mailer = require("./mailer");

module.exports = {
    // task can be scheduled, but at the moment it's executed after every login of a canton user
    removeInactiveUsers() {
        models.GlobalSetting.findOne({ where: {setting: 'inactive_user_wait_time'}})
            .then((waitTimeSetting) => {
                let waitTime = waitTimeSetting.value
                const now = new Date();
                const removeBelowDate = new Date(now.setDate(now.getDate() - waitTime));

                models.User.destroy({
                    where: {
                        is_authorized: false,
                        updatedAt: {
                            [Op.lt]: removeBelowDate
                        }
                    }
                })
                    .then((res) => {
                        console.log(res)
                    })
                    .catch((err) => {
                        Mailer.sendSupportNotification('inactive user removal failed',
                            "Server error while trying to remove users:" + err)
                    })
            })
            .catch((err) => {
                Mailer.sendSupportNotification('inactive user removal failed',
                    "Server error while trying to remove users:" + err)
            })
    }
}