module.exports = (sequelize, Sequelize) => {

    const Municipal = sequelize.define("Municipal", {
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

    return Municipal;
};