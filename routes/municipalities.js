const express = require('express');
const router = express.Router();
const models = require('../models')
const { Op } = require("sequelize");
const permissions = require("../services/permissions")
const PushSettings = require("../services/pushSettings")

router.get('/', async (req, res) => {
    try {
        let municipals = []

        // if user is municipality user, only return list with single municipality
        if (req.user.MunicipalityId) {
            let municipality = await models.Municipality.findByPk(req.user.MunicipalityId)
            // add to array so response type does not change
            municipals.push(municipality)
        } else {
            permissions.checkCantonPermission(req.user)
            municipals = await models.Municipality.findAll({
                attributes: ['id', 'name'],
                order: ['name']
            })
        }

        res.json(municipals)
    } catch {
        res.status(404).send({error: "municipal list could not be retrieved"})
    }
})

router.get('/:municipalityid', async (req, res) => {
    try {

            let municipality = await models.Municipality.findByPk(req.params.municipalityid, {
                include: models.Address
            })

            permissions.checkMunicipalityPermission(req.user, municipality.id)

        res.json(municipality)
    } catch (ex) {
        res.status(404).send({error: "municipal list could not be retrieved"})
    }
})

//update municipality address
router.patch('/:municipalityid/addresses/:addressid', async (req, res) => {
    try {

        let municipality = await models.Municipality.findByPk(req.params.municipalityid)
        let address = await models.Address.findByPk(req.params.addressid)

        permissions.checkMunicipalityPermission(req.user, municipality.id)

        if (req.body.line_1 || req.body.line_1 === '') {
            address.line_1 = req.body.line_1
        }

        if (req.body.line_2 || req.body.line_2 === '') {
            address.line_2 = req.body.line_2
        }

        if (req.body.line_3 || req.body.line_3 === '') {
            address.line_3 = req.body.line_3
        }

        if (req.body.line_4 || req.body.line_4 === '') {
            address.line_4 = req.body.line_4
        }

        if (req.body.zip || req.body.zip === '') {
            address.zip = req.body.zip
        }

        if (req.body.city || req.body.city === '') {
            address.city = req.body.city
        }

        await address.save()

        await PushSettings.pushSettingsToFormSystem()

        res.status(200).send("Address updated")
    } catch (ex) {
        res.status(404).send({error: "address could not be updated"})
    }
})



module.exports = router;