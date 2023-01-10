const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const Status = require("../utils/status");
const permissions = require("../services/permissions");
const PushSettings = require("../services/pushSettings");

/*
 * get gas operator list
 */
router.get('', async (req, res) => {
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

/*
 * get gas operator list
 */
router.get('/:id', async (req, res) => {
    try {
        permissions.checkCantonPermission(req.user);
        let gasOperator = await models.GasOperator.findByPk(req.params.id, {
            attributes: ['id', 'name', 'short_name']
        })

        res.json(gasOperator)
    } catch (ex) {
        res.status(404).send({error: "gas operator could not be retrieved", message: ex.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        permissions.checkCantonPermission(req.user);
        let gasOperator = await models.GasOperator.findByPk(req.params.id)
        await gasOperator.destroy()
        await PushSettings.pushSettingsToFormSystem()
        res.status(200).json({message: 'gas operator deleted'})
    } catch (ex) {
        res.status(404).send({error: "gas operator could not be retrieved", message: ex.message})
    }
})

router.post('/', async (req, res) => {
    try {
        permissions.checkCantonPermission(req.user);

        if (req.body.name && req.body.short_name){
            let gasOperator = await models.GasOperator.build({
                name: req.body.name,
                short_name: req.body.short_name
            })

            await gasOperator.save()
            await PushSettings.pushSettingsToFormSystem()
            res.status(200).json({message: 'gas operator created'})
        } else {
            res.status(404).send({error: "gas operator could not be created", message: 'bad request'})
        }
    } catch (ex) {
        res.status(404).send({error: "gas operator could not be created", message: ex.message})
    }
})


router.patch('/:id', async (req, res) => {
    try {
        permissions.checkCantonPermission(req.user);
        let gasOperator = await models.GasOperator.findByPk(req.params.id)

        if (req.body.name && req.body.name !== gasOperator.name) {
            gasOperator.name = req.body.name
        }

        if (req.body.short_name && req.body.short_name !== gasOperator.short_name) {
            gasOperator.short_name = req.body.short_name
        }

        await gasOperator.save()

        await PushSettings.pushSettingsToFormSystem()

        res.status(200).json({message: 'gas operator updated'})
    } catch (ex) {
        res.status(404).send({error: "settings could not be retrieved", message: ex.message})
    }
})




module.exports = router;