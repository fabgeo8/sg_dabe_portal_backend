const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const Status = require("../utils/status");
const {expressjwt: jwt} = require('express-jwt');
const fs = require('fs')

const publicKey = fs.readFileSync("dev-gm5pjwd8.pem");
// const payload = jwt({secret: publicKey, algorithms: ["RS256"]});

// Verify using getKey callback
/*var jwksClient = require('jwks-rsa');
var client = jwksClient({
    jwksUri: 'https://dev-gm5pjwd8.us.auth0.com/.well-known/jwks.json'
});*/

/*function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}*/

var jwtCheck = jwt({
    secret: publicKey,
    audience: 'http://localhost:3005',
    issuer: 'https://dev-gm5pjwd8.us.auth0.com/',
    algorithms: ['RS256']
});


router.get('/gas', jwtCheck, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];

        /*jwt.verify(token, getKey, {}, function (err, decoded) {
            console.log(decoded.foo) // bar
        });*/

        let gasApplications = await models.GasApplication.findAll({
            order: ['createdAt'],
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name']
                }],
            attributes: ['id', 'createdAt', 'identifier', 'version', 'object_egid', 'object_street', 'object_streetnumber', 'object_zip', 'object_city', 'address', 'object_plot', 'generator_area', 'fee', 'boiler_replacement_year', 'year_of_construction', 'status', 'remark']
        })

        res.json(gasApplications)
    } catch (ex) {
        res.status(404).send({error: "application list could not be retrieved", message: ex.message})
    }

})

module.exports = router;