module.exports = (sequelize, Sequelize) => {

    const Address = sequelize.define("Address", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        line_1: {
            type: Sequelize.STRING
        },
        line_2: {
            type: Sequelize.STRING
        },
        line_3: {
            type: Sequelize.STRING
        },
        line_4: {
            type: Sequelize.STRING
        },
        zip: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        application_type: {
            type: Sequelize.STRING
        }
    });

    return Address;
};