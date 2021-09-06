const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op, UUIDV4} = require("sequelize");
const moment = require('moment');
const pdf = require('pdf-creator-node');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require("path");

router.post('/', async (req, res) => {
    try {
        let fuelApplication = await models.FuelApplication.build({
            egid: req.body.egid,
            object_street: req.body.object_street,
            object_streetnumber: req.body.object_streetnumber,
            object_zip: req.body.object_zip,
            object_city: req.body.object_city,
            object_plot: req.body.object_plot,
            generator_area: req.body.generator_area,
            year_of_construction: req.body.year_of_construction,
            fuel_type: req.body.fuel_type,
            boiler_replacement_year: req.body.boiler_replacement_year,
            contact_name: req.body.contact_name,
            contact_phone: req.body.contact_phone,
            contact_email: req.body.contact_email,
            builder_street: req.body.builder_street,
            builder_location: req.body.builder_location,
            builder_name: req.body.builder_name,
        })

        let identifier = moment().format('YYMMDD')
        //todo replace moment.js
        if (req.body.egid) {
            identifier = identifier + '_' + req.body.egid;
        }else if (req.body.object_plot){
            identifier = identifier + '_' + req.body.object_plot;
        }else {
            res.status(404).send("invalid request")
            return
        }

        let date = new Date()
        date.setHours(0, 0, 0, 0)

        //check if an application for this address has already been made on this day
        let previousVersion = await models.FuelApplication.findAll({
            where: {
                object_street: fuelApplication.object_street,
                object_streetnumber: fuelApplication.object_streetnumber,
                object_zip: fuelApplication.object_zip,
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
            fuelApplication.version = previousVersion[0].version + 1
        } else {
            // first version
            fuelApplication.version = 1
        }

        // assign identifier to application
        identifier = identifier + '_' + fuelApplication.version
        fuelApplication.identifier = identifier

        // get municipal id and check if municipal is available in municipal table
        // this is important to have reference for municipal contact email
        let municipal = await models.Muncipal.findByPk(req.body.municipal);

        if (municipal) {
            fuelApplication.municipal = req.body.municipal
        } else {
            res.status(404).send({error: 'invalid municipal'})
            return
        }

        fuelApplication.pdf_identifier = uuidv4()

        await fuelApplication.save()

        res.status(200).send({
            pdf_identifier: fuelApplication.pdf_identifier
        })
    } catch (err) {
        res.status(404).send({error: "event could not be created"})
    }
})

router.get('/pdf/:identifier', async (req, res) => {

    let html = fs.readFileSync('templates/fuel_application.html', 'utf8');

    let options = {
        format: "A4",
        orientation: "portrait",
        border: "8.8mm",
    };


    let fuelApplication = await models.FuelApplication.findOne({ where : { pdf_identifier: req.params.identifier }})

    if (!fuelApplication) {
        res.status(404).send("invalid pdf")
    }

    let municipal = await models.Muncipal.findByPk(fuelApplication.municipal)

    let document = {
        html: html,
        data: {
            application: fuelApplication.dataValues,
            municipal: municipal.dataValues
        },
        path: "pdf/temp.pdf",
        type: "stream",
    };

    pdf
        .create(document, options)
        .then((doc) => {
            res.download(doc.path)
            //res.send("ok")
        })
        .catch((error) => {
            res.send(error)
            console.error(error);
        });

})


module.exports = router;