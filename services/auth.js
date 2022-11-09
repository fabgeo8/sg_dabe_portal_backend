const models = require("../models");
const axios = require("axios");
const Roles = require("../utils/roles");

module.exports = {
    /**
     * user is authenticated with oidc, check if user is present in user db
     * if user is not present add new user without any access roles and flag as unauthorized
     */
    async checkUserAuthorization(req, res, next) {
        try {


            let oidc_userid = req.auth.sub

            let user = await models.User.findOne({ where: {oidc_userid: oidc_userid}})

            if (user) {
                // check if user is configured as active user
                if (checkUserActive(user)) {
                    req.user = user
                    return next()
                } else {
                    // user is not active and has to be assigned by an admin
                    let err = new Error('user_not_configured');
                    err.status = 401;
                    return next(err)
                }
            } else {
                // user does not exist in db, add as new user, user auth header from incoming request to look for user information
                getUserInformation(oidc_userid, req.get("Authorization"))

                // user will be added as new user, the request is still unauthorized
                let err = new Error('user_not_configured');
                err.status = 401;
                return next(err)
            }


        } catch (e) {
            let err = new Error('authentication_error');
            err.status = 401;
            return next(err)
        }
    },
}

function checkUserActive(user) {
    if (user.is_authorized === true && Object.values(Roles).includes(user.role)) {
        return true;
    }

    return false;
}

function getUserInformation(userId, authHeader) {
    // request user information from account information with access token
    const config = {
        headers: {
            Authorization: authHeader
        }
    }
    axios.get(process.env.OIDC_BASE_URI + '/me', config)
        .then((res) => {
            if (res.status === 200) {
                createNewUser(userId, res.data)
            } else {
                console.log("user information could not be retrieved from oidc account")
            }
        })
}

function createNewUser(userId, user) {
    models.User.create({
        oidc_userid: userId,
        fullname: user.name,
        email: user.email,
        is_authorized: false
    })
        .then((result) => {
            console.log("User created", result)
        })
        .catch((err) => {
            console.log("user was not created!", err)
        });
}

