const express = require('express');
const router = express.Router();
const models = require('../models')
const { Op } = require("sequelize");

router.get('/', async (req, res) => {
    try {
        let municipals = await models.Municipality.findAll({
            attributes: ['id', 'name'],
            order: ['name']
        })

        res.json(municipals)
    } catch {
        res.status(404).send({error: "municipal list could not be retrieved"})
    }
})

module.exports = router;