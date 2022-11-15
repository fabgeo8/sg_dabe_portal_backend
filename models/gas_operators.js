module.exports = (sequelize, Sequelize) => {

    const GasOperator = sequelize.define("GasOperator", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
    });

    return GasOperator;
};