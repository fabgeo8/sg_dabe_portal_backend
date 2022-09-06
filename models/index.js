const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
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

db.GasApplication.belongsTo(db.Municipality);
db.Municipality.hasOne(db.GasApplication);

db.PvApplication.belongsTo(db.Municipality);
db.Municipality.hasOne(db.PvApplication);

/* define relations
db.Event.hasMany(db.EventWindow);
db.EventWindow.belongsTo(db.Event)

db.Event.belongsTo(db.EventLocation);
db.EventLocation.hasMany(db.Event);

db.EventLocation.belongsTo(db.Operator);
db.Operator.hasMany(db.EventLocation)

db.Operator.hasMany(db.User);
db.User.belongsTo(db.Operator)
*/


module.exports = db;
