module.exports = (sequelize, Sequelize) => {

    const Event = sequelize.define("Event", {
        identifier: {
            type: Sequelize.STRING
        },
        title: {
            type: Sequelize.STRING
        },
        startDate: {
            type: Sequelize.DATEONLY
        },
        endDate: {
            type: Sequelize.DATEONLY
        }
    });

    return Event;
};