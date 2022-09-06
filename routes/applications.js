const express = require('express');
const router = express.Router();
const models = require('../models')
const { Op } = require("sequelize");

router.get('/gas', async (req, res) => {
    try {

        let gasApplications = await models.GasApplication.findAll({
            order: ['createdAt'],
            include: [
            {
                model: models.Municipality,
                attributes: ['name']
            }
        ]
        })

        res.json(gasApplications)
    } catch (ex) {
        res.status(404).send({error: "application list could not be retrieved", message: ex.message})
    }
})

router.get('/gas/:id', async (req, res) => {
    try {

        let gasApplication = await models.GasApplication.findByPk(req.params.id, {
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name']
                }
            ]
        })

        res.json(gasApplication)
    } catch (ex) {
        res.status(404).send({error: "gas application could not be retrieved", message: ex.message})
    }
})

router.get('/pv', async (req, res) => {
    try {

        let pvApplications = await models.PvApplication.findAll({
            order: ['createdAt'],
            raw: true
        })

        res.json(pvApplications)
    } catch (ex) {
        res.status(404).send({error: "application list could not be retrieved", message: ex.message})
    }
})

module.exports = router;