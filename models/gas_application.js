module.exports = (sequelize, Sequelize) => {

    const GasApplication = sequelize.define("GasApplication", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        identifier: {
            type: Sequelize.STRING
        },
        application_type: {
            type: Sequelize.INTEGER
        },
        status: {
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
        fee: {
            type: Sequelize.FLOAT
        }
    });

    return GasApplication;
};