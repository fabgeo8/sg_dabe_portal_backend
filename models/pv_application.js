module.exports = (sequelize, Sequelize) => {

    const PvApplication = sequelize.define("PvApplication", {
        identifier: {
            type: Sequelize.STRING
            //unique
            //DATE_EGID/PLOT_VERSION
            //20210713_123451_1
        },
        municipal: {
            type: Sequelize.STRING
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
            type: Sequelize.STRING
        },
        contact_name: {
            type: Sequelize.STRING
        },
        contact_phone: {
            type: Sequelize.STRING
        },
        contact_email: {
            type: Sequelize.STRING
        },
        builder_street: {
            type: Sequelize.STRING
        },
        builder_location: {
            type: Sequelize.STRING
        },
        builder_email: {
            type: Sequelize.STRING
        },
        fee: {
            type: Sequelize.FLOAT
        },
    });

    return PvApplication;
};