const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config();
const db = require("./models");
const cookieParser = require('cookie-parser');

const apiPath = '/api/v1/';

var indexRouter = require('./routes/index');
var municipalityRouter = require('./routes/municipals');
var gasApplicationRouter = require('./routes/gasApplications');
var pvApplicationRouter = require('./routes/pvApplications');
var authRouter = require('./routes/AuthRoutes');
const {application} = require("express");

const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

var corsOptions = {
    // credentials: true,
    origin: process.env.CORS_ORIGIN
}

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: "50mb"}))
app.use(require('cookie-parser')());

//connect db
db.sequelize.sync({
    // force: true
}).then(() => {
    console.log('synchroniseModels: Success!');
}).catch(err => console.log(err));

//include routes
app.use(apiPath, indexRouter);
app.use(apiPath + 'municipalities', municipalityRouter);
app.use(apiPath + 'applications/gas', gasApplicationRouter);
app.use(apiPath + 'applications/pv', pvApplicationRouter);
app.use(apiPath + 'auth', authRouter);

app.listen(process.env.PORT || 3005, () => {
    console.log("Server has started!")
})

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
