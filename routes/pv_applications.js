const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const moment = require('moment');

router.post('/', async (req, res) => {
    try {
        console.log("request ok")
        let pvApplication = await models.PvApplication.build({
            egid: req.body.egid,
            object_street: req.body.object_street,
            object_streetnumber: req.body.object_streetnumber,
            object_zip: req.body.object_zip,
            object_city: req.body.object_city,
            object_plot: req.body.object_plot,
            generator_area: req.body.generator_area,
            contact_name: req.body.contact_name,
            contact_phone: req.body.contact_phone,
            contact_email: req.body.contact_email,
            builder_street: req.body.builder_street,
            builder_location: req.body.builder_location,
            builder_name: req.body.builder_name
        })

        //todo replace moment.js
        let identifier = moment().format('YYMMDD') + '_' + req.body.egid;

        let date = new Date()
        date.setHours(0, 0, 0, 0)

        //check if an application for this address has already been made on this day
        let previousVersion = await models.PvApplication.findAll({
            where: {
                object_street: pvApplication.object_street,
                object_streetnumber: pvApplication.object_streetnumber,
                object_zip: pvApplication.object_zip,
                createdAt: {
                    [Op.gte]: date
                }
            },
            order: [
                ['version', 'DESC']
                ]
        })

        if (previousVersion.length > 0) {
            // there are previous version for same address
            // get highest version number of previous versions
            pvApplication.version = previousVersion[0].version + 1
        } else {
            // first version
            pvApplication.version = 1
        }

        // assign identifier to application
        identifier = identifier + '_' + pvApplication.version
        pvApplication.identifier = identifier

        // get municipal id and check if municipal is available in municipal table
        // this is important to have reference for municipal contact email
        let municipal = await models.Muncipal.findByPk(req.body.municipal);

        if (municipal) {
            pvApplication.municipal = req.body.municipal
        } else {
            res.status(404).send({error: 'invalid municipal'})
            return
        }

        await pvApplication.save()

        res.status(200).send("created")
    } catch (err) {
        res.status(404).send({error: "event could not be created"})
    }
})

module.exports = router;