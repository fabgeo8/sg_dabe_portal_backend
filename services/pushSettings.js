const models = require("../models");
const axios = require("axios");
const Mailer = require("./mailer")

const publicApiHost = process.env.PUBLIC_API_HOST

module.exports = {
    async pushSettingsToFormSystem () {
        try {
            let municipalities = await models.Municipality.findAll({
                include: models.Address
            })

            const requestConfig = {
                headers:{
                    access_key: process.env.ACCESS_KEY_FORMSYSTEM
                }
            };

            axios.post(publicApiHost + '/municipalities', {municipalities: municipalities}, requestConfig)
                .then((res) => {
                    if (res.status === 200) {
                        console.log('municipalities pushed to api successfully')
                    } else {
                        Mailer.sendSupportNotification('municipaity push failed',
                            "Response error while trying to push municipalities:" + res)
                    }
                })
                .catch((err) => {
                    console.log("Error while trying to push municipalities", err)

                    Mailer.sendSupportNotification('municipality push failed',
                        "Server error while trying to push municipalities:" + err)
                })

            let gasOperators = await models.GasOperator.findAll()

            axios.post(publicApiHost + '/gas_operators', {gasoperators: gasOperators}, requestConfig)
                .then((res) => {
                   if (res.status === 200) {
                       console.log('gasoperators pushed to api successfully')
                   } else {
                       Mailer.sendSupportNotification('gas operator push failed',
                           "Response error while trying to push gasoperators:" + res)
                   }
                })
                .catch((err) => {
                    console.log("Error while trying to push gasoperators", err)

                    Mailer.sendSupportNotification('gas operator push failed',
                        "Server error while trying to push gasoperators:" + err)
                })

            return true
        } catch (err) {
            Mailer.sendSupportNotification('server error on settings push',
                "General error on settings push:" + err)

            return false
        }
    }
}