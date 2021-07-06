const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
require('dotenv').config();
const db = require("./models");

const apiPath = '/api/v1/';

var indexRouter = require('./routes/index');

const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

var corsOptions = {
    credentials: true,
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

app.listen(process.env.PORT || 3005, () => {
    console.log("Server has started!")
})

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
