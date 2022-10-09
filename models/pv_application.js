module.exports = (sequelize, Sequelize) => {

    const PvApplication = sequelize.define("PvApplication", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        identifier: {
            type: Sequelize.STRING,
            unique: true
            //DATE_EGID/PLOT_VERSION
            //20210713_123451_1
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
            type: Sequelize.FLOAT
        },
        fee: {
            type: Sequelize.FLOAT
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

    return PvApplication;
};