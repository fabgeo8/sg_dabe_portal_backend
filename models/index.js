const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.GasApplication = require("./gas_application")(sequelize, Sequelize);
db.PvApplication = require("./pv_application")(sequelize, Sequelize);
db.Municipality = require("./municipalities")(sequelize, Sequelize);
db.User = require("./users")(sequelize, Sequelize);
db.GasOperator = require("./gas_operators")(sequelize, Sequelize);
db.Address = require("./addresses")(sequelize, Sequelize);
db.Activity = require("./activities")(sequelize, Sequelize);

db.GasApplication.belongsTo(db.Municipality);
db.Municipality.hasOne(db.GasApplication);

db.PvApplication.belongsTo(db.Municipality);
db.Municipality.hasOne(db.PvApplication);

db.Municipality.hasMany(db.Address);
db.Address.belongsTo(db.Municipality);

db.GasApplication.hasMany(db.Activity, {
    foreignKey: 'application',
    constraints: false
})
db.Activity.belongsTo(db.GasApplication, {
    foreignKey: 'application',
    constraints: false
})

db.PvApplication.hasMany(db.Activity, {
    foreignKey: 'application',
    constraints: false
})
db.Activity.belongsTo(db.PvApplication, {
    foreignKey: 'application',
    constraints: false
})

module.exports = db;
