module.exports = (sequelize, Sequelize) => {

    const GasApplication = sequelize.define("GasApplication", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        identifier: {
            type: Sequelize.STRING,
            unique: true
        },
        status: {
            type: Sequelize.INTEGER
        },
        version: {
            type: Sequelize.INTEGER
        },
        object_egid: {
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
        remark: {
            type: Sequelize.TEXT
        },
        pdf_identifier: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.VIRTUAL,
            get(){
                return `${this.object_street} ${this.object_streetnumber}, ${this.object_zip} ${this.object_city}`
            }
        }
    });

    return GasApplication;
};