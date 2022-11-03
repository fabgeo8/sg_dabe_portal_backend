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
        last_status_date: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        status_changed_dates: {
            type: Sequelize.TEXT,
            get () {
                if (this.getDataValue('status_changed_dates') == null) {
                    return {}
                } else {
                    return JSON.parse(this.getDataValue('status_changed_dates'));
                }
            },
            set (value) {
                this.setDataValue('status_changed_dates', JSON.stringify(value));
            }
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