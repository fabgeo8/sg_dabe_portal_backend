const express = require('express');
const router = express.Router();
const models = require('../models')
const { Op } = require("sequelize");

router.get('/', async (req, res) => {
    try {
        let pvApplications = await models.PvApplication.findAll({
            order: ['createdAt'],
            raw: true
        })

        let gasApplications = await models.FuelApplication.findAll({
            order: ['createdAt'],
            raw: true
        })

        let result = pvApplications.concat(gasApplications)

        result.forEach(application => {
            if ('boiler_replacement_year' in application) {
                application.type = 'gas'
            } else {
                application.type = 'pv'
            }
            application.status = 0
        })

        res.json(result)
    } catch (ex) {
        res.status(404).send({error: "application list could not be retrieved", message: ex.message})
    }
})

module.exports = router;