const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config();
const db = require("./models");
const jwtCheck = require('./services/jwtCheck');

const apiPath = '/api/v1/';

const indexRouter = require('./routes/index');
const municipalityRouter = require('./routes/municipals');
const gasApplicationRouter = require('./routes/gasApplications');
const pvApplicationRouter = require('./routes/pvApplications');
const authRouter = require('./routes/AuthRoutes');
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
app.use(apiPath + 'municipalities', municipalityRouter);
app.use(apiPath + 'applications/gas', gasApplicationRouter);
app.use(apiPath + 'applications/pv', pvApplicationRouter);
app.use(apiPath + 'users', userRouter);

app.use(jwtCheck);
app.use(apiPath + 'auth', authRouter);

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