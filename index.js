const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config();
const db = require("./models");
const jwtCheck = require('./services/jwtCheck');
const auth = require('./services/auth');

const apiPath = '/api/v1/';

const indexRouter = require('./routes/index');
const municipalityRouter = require('./routes/municipalities');
const gasApplicationRouter = require('./routes/gasApplications');
const pvApplicationRouter = require('./routes/pvApplications');
const userRouter = require('./routes/users');

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

// check access token on each incoming request for all routes after this statement
// 401 unauthorized is returned if no or invalid access_token is provided
app.use(jwtCheck);
app.use(auth.checkUserAuthorization);
// check user authorization for each incoming request for all routes after this statement
// user is returned from db with given userid in access_token, 401 is returned if user is not authorized, i.e. is_authorized = false
app.use(apiPath + 'municipalities', municipalityRouter);
app.use(apiPath + 'applications/gas', gasApplicationRouter);
app.use(apiPath + 'applications/pv', pvApplicationRouter);
app.use(apiPath + 'users', userRouter);

// catch error request
app.use(function(err, req, res, next) {
    if (err.status) {
        res.status(err.status).json({message: err.message})
    } else {
        res.status(500).json({message: "unhandled server error"})
    }
});

app.listen(process.env.PORT || 3005, () => {
    console.log("Server has started!")
})