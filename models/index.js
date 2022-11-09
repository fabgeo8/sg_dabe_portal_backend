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

db.GasApplication.belongsTo(db.Municipality);
db.Municipality.hasOne(db.GasApplication);

db.PvApplication.belongsTo(db.Municipality);
db.Municipality.hasOne(db.PvApplication);

module.exports = db;
