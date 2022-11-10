const Roles = require('../utils/roles')
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
        },
        role_name: {
            type: Sequelize.VIRTUAL,
            get(){
                if ([Roles.CANTON_ADMIN, Roles.MUNICIPALITY_ADMIN].includes(this.role)) {
                    return 'admin'
                } else if ([Roles.CANTON_USER, Roles.MUNICIPALITY_USER].includes(this.role)) {
                    return 'user'
                } else {
                    return 'undefined'
                }
            }
        }
    });

    return User;
};