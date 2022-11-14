const express = require('express');
const router = express.Router();
const models = require('../models')
const { Op } = require("sequelize");
const permissions = require("../services/permissions")

router.get('/', async (req, res) => {
    try {
        let municipals = []

        // if user is municipality user, only return list with single municipality
        if (req.user.MunicipalityId) {
            municipals = await models.Municipality.findByPk(req.user.MunicipalityId)
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

module.exports = router;