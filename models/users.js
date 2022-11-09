module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define("User", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        oidc_userid: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        fullname: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        is_authorized: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        role: {
            type: Sequelize.INTEGER
        },
        MunicipalityId: {
            type: Sequelize.STRING
        },
        last_login: {
            type: Sequelize.DATE
        }
    });

    return User;
};