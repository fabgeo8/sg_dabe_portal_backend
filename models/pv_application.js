module.exports = (sequelize, Sequelize) => {

    const PvApplication = sequelize.define("PvApplication", {
        identifier: {
            type: Sequelize.STRING
            //unique
            //DATE_EGID/PLOT_VERSION
            //20210713_123451_1
        },
        version: {
            type: Sequelize.INTEGER
        },
        municipal: {
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
        builder_name: {
            type: Sequelize.STRING
        },
        fee: {
            type: Sequelize.FLOAT
        },
        pdf_identifier: {
            type: Sequelize.STRING
        }
    });

    return PvApplication;
};