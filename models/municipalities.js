module.exports = (sequelize, Sequelize) => {

    const Municipality = sequelize.define("Municipality", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        bfs: {
            type: Sequelize.INTEGER
        },
        contact: {
            type: Sequelize.STRING
        }
    });

    return Municipality;
};