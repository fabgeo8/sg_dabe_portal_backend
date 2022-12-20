const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const Status = require("../utils/status");
const permissions = require("../services/permissions");
const axios = require('axios')

const publicApiHost = process.env.PUBLIC_API_HOST

router.post('/push_settings', async (req, res) => {
    try {
        permissions.checkAllUserPermission(req.user)

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
                console.log('municipalities pushed to api successfully')
            })
            .catch((err) => {
                console.log("Error while trying to push municipalities", err)
            })

        let gasOperators = await models.GasOperator.findAll()

        axios.post(publicApiHost + '/gas_operators', {gasoperators: gasOperators}, requestConfig)
            .then((res) => {
                console.log('gasoperators pushed to api successfully')
            })
            .catch((err) => {
                console.log("Error while trying to push gasoperators", err)
            })


        res.status(200).json({
            message: "sync successful"
        })
    } catch {
        res.status(404).send({error: "municipal list could not be retrieved"})
    }
})

/*
 * get gas operator list
 */
router.get('/gas_operators', async (req, res) => {
    try {
        let gasOperators = await models.GasOperator.findAll({
            order: [['name', 'ASC']],
            attributes: ['id', 'name', 'short_name']
        })

        res.json(gasOperators)
    } catch (ex) {
        res.status(404).send({error: "gas operator list could not be retrieved", message: ex.message})
    }
})


module.exports = router;