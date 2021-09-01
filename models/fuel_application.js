module.exports = (sequelize, Sequelize) => {

    const FuelApplication = sequelize.define("FuelApplication", {
        identifier: {
            type: Sequelize.STRING
        },
        version: {
            type: Sequelize.INTEGER
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
        year_of_construction: {
            type: Sequelize.INTEGER
        },
        boiler_replacement_year: {
            type: Sequelize.INTEGER
        },
        fuel_type: {
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
        builder_name: {
            type: Sequelize.STRING
        },
        builder_street: {
            type: Sequelize.STRING
        },
        builder_location: {
            type: Sequelize.STRING
        },
        pdf_identifier: {
            type: Sequelize.STRING
        }
    });

    return FuelApplication;
};