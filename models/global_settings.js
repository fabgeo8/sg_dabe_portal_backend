module.exports = (sequelize, Sequelize) => {

    const GlobalSetting = sequelize.define("GlobalSetting", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        setting: {
            type: Sequelize.STRING
        },
        value: {
            type: Sequelize.STRING
        },
        application_type: {
            type: Sequelize.STRING
        }
    });

    return GlobalSetting;
};