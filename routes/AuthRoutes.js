const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const Status = require("../utils/status");
const fs = require('fs')
const auth = require('../services/auth');
const permissions = require('../services/permissions')

router.get('/gas', auth.checkUserAuthorization, async (req, res) => {
    try {


        let gasApplications = await models.GasApplication.findAll({
            order: ['createdAt'],
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name']
                }],
            attributes: ['id', 'createdAt', 'identifier', 'version', 'object_egid', 'object_street', 'object_streetnumber', 'object_zip', 'object_city', 'address', 'object_plot', 'generator_area', 'boiler_replacement_year', 'year_of_construction', 'status', 'remark']
        })

        res.json(gasApplications)
    } catch (ex) {
        res.status(ex.status || 404).send({error: "application list could not be retrieved", message: ex.message})
    }
})

module.exports = router;