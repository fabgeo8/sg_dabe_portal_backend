module.exports = (sequelize, Sequelize) => {

  const Activity = sequelize.define("Activity", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    changed_value: {
      type: Sequelize.STRING
    },
    activity_text: {
      type: Sequelize.STRING
    },
    changed_by: {
      type: Sequelize.STRING
    },
    application: {
      type: Sequelize.STRING
    },
    application_type: {
      type: Sequelize.STRING
    },
    identifier: {
      type: Sequelize.STRING
    }
  });

  return Activity;
};