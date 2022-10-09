const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const Status = require("../utils/status");

router.get('/', async (req, res) => {
    try {
        let queryFilter = {}
        let queryParams = req.query
        if (queryParams.municipality && queryParams.municipality !== 'undefined' && queryParams.municipality !== 'null' && queryParams.municipality !== '0') {
            // todo: check if user is allowed to query this municipality
            // todo check if user is admin or municipality user, if municipality user automatically always use municipality filter
            queryFilter.MunicipalityId = queryParams.municipality
        }

        if (queryParams.dateFrom && queryParams.dateFrom !== 'undefined' && queryParams.dateFrom !== 'null' &&
            queryParams.dateTo && queryParams.dateTo !== 'undefined' && queryParams.dateTo !== 'null'){
            // todo: check if user is allowed to query this municipality
            // todo: correct if match to make it more robust
            let dateFrom = new Date(queryParams.dateFrom)
            let dateTo = new Date(queryParams.dateTo)
            dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59)

            queryFilter.createdAt = {
                [Op.gte]: dateFrom,
                [Op.lte]: dateTo,
            }
        }

        let gasApplications = await models.GasApplication.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }],
            attributes: ['id', 'createdAt', 'identifier', 'version', 'object_egid', 'object_street', 'object_streetnumber', 'object_zip', 'object_city', 'fuel_type', 'address', 'object_plot', 'generator_area', 'boiler_replacement_year', 'year_of_construction', 'status', 'remark']
        })

        res.json(gasApplications)
    } catch (ex) {
        res.status(404).send({error: "application list could not be retrieved", message: ex.message})
    }
})

router.get('/:id', async (req, res) => {
    try {

        let gasApplication = await models.GasApplication.findByPk(req.params.id, {
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }
            ]
        })

        res.json(gasApplication)
    } catch (ex) {
        res.status(404).send({error: "gas application could not be retrieved", message: ex.message})
    }
})

router.get('/by_identifier/:id', async (req, res) => {
    try {

        let gasApplication = await models.GasApplication.findOne({where: {identifier: req.params.id}}, {
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }
            ]
        })

        res.json(gasApplication)
    } catch (ex) {
        res.status(404).send({error: "gas application could not be retrieved", message: ex.message})
    }
})

router.patch('/:id', async (req, res) => {
    try {
        let gasApplication = await models.GasApplication.findByPk(req.params.id)

        if (req.body.object_egid || req.body.object_egid === '') {
            gasApplication.object_egid = req.body.object_egid
        }

        if (req.body.object_street || req.body.object_street === '') {
            gasApplication.object_street = req.body.object_street
        }

        if (req.body.object_streetnumber || req.body.object_streetnumber === '') {
            gasApplication.object_streetnumber = req.body.object_streetnumber
        }

        if (req.body.object_city || req.body.object_city === '') {
            gasApplication.object_city = req.body.object_city
        }

        if (req.body.object_zip || req.body.object_zip === '') {
            gasApplication.object_zip = req.body.object_zip
        }

        // todo: add remark to model and db
        if (req.body.remark || req.body.remark === '') {
            gasApplication.remark = req.body.remark
        }

        // todo: check if request is authorized to change municipality
        // todo: check if municipality exists, so reference is always given
        if (req.body.municipality) {
            gasApplication.MunicipalityId = req.body.municipality
        }

        if (req.body.status) {
            // only allow possible status
            if (Object.values(Status).includes(req.body.status)) {
                gasApplication.status = req.body.status
            }
        }

        if (req.body.remark || req.body.remark === '') {
            gasApplication.remark = req.body.remark
        }

        await gasApplication.save()

        res.status(200).send("Application updated")
    } catch (ex) {
        res.status(404).send({error: "Application could not be updated", message: ex.message})
    }
})

module.exports = router;