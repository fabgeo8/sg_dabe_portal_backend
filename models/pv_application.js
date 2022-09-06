module.exports = (sequelize, Sequelize) => {

    const PvApplication = sequelize.define("PvApplication", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        identifier: {
            type: Sequelize.STRING
            //unique
            //DATE_EGID/PLOT_VERSION
            //20210713_123451_1
        },
        status: {
            type: Sequelize.INTEGER
        },
        application_type: {
            type: Sequelize.INTEGER
        },
        version: {
            type: Sequelize.INTEGER
        },
        egid: {
            type: Sequelize.STRING
        },
        object_street: {
            type: Sequelize.STRING
        },
        object_streetnumber: {
            type: Sequelize.STRING
        },
        object_zip: {
            type: Sequelize.STRING
        },
        object_city: {
            type: Sequelize.STRING
        },
        object_plot: {
            type: Sequelize.STRING
        },
        generator_area: {
            type: Sequelize.FLOAT
        },
        builder_street: {
            type: Sequelize.STRING
        },
        builder_location: {
            type: Sequelize.STRING
        },
        builder_name: {
            type: Sequelize.STRING
        },
        fee: {
            type: Sequelize.FLOAT
        },
    });

    return PvApplication;
};