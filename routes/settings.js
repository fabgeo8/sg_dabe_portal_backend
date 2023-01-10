const express = require('express');
const router = express.Router();
const models = require('../models')
const permissions = require("../services/permissions");
router.get('/global', async (req, res) => {
    try {
        permissions.checkCantonPermission(req.user);
        let settings = await models.GlobalSetting.findAll({
            attributes: ['setting', 'value']
        })

        res.json(settings)
    } catch (ex) {
        res.status(404).send({error: "settings could not be retrieved", message: ex.message})
    }
})

router.patch('/global/:setting', async (req, res) => {
    try {
        permissions.checkCantonPermission(req.user);
        let setting = await models.GlobalSetting.findOne({ where: {setting: req.params.setting}})

        setting.value = req.body.value

        await setting.save()

        res.status(200).json({message: 'setting updated'})
    } catch (ex) {
        res.status(404).send({error: "settings could not be retrieved", message: ex.message})
    }
})

module.exports = router;