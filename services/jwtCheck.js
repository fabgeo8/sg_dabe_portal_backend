const {expressjwt: jwt} = require("express-jwt");
const jwksClient = require("jwks-rsa");

module.exports = jwt({
    secret: jwksClient.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: 'https://accounts.abraxas.ch/keys'
    }),
    // Validate the audience and the issuer.
    audience: 'ktsg-formularsystem',
    issuer: 'https://accounts.abraxas.ch/',
    algorithms: [ 'RS256' ]
});