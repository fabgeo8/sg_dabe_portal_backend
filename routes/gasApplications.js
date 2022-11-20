const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const Status = require("../utils/status");
const permissions = require("../services/permissions");
const Activity = require("../services/activities");

const GAS_ATTRIBUTES = ['id', 'createdAt', 'identifier', 'version', 'object_egid', 'object_street', 'object_streetnumber', 'object_zip', 'object_city', 'fuel_type', 'address', 'object_plot', 'generator_area', 'boiler_replacement_year', 'gas_operator', 'year_of_construction', 'status', 'remark', 'last_status_date', 'status_changed_dates', 'MunicipalityId']

router.get('/', async (req, res) => {
    try {
        let queryFilter = {}
        let queryParams = req.query
        if (queryParams.municipality && queryParams.municipality !== 'undefined' && queryParams.municipality !== 'null' && queryParams.municipality !== '0') {
            // todo: check if user is allowed to query this municipality
            // todo check if user is admin or municipality user, if municipality user automatically always use municipality filter
            queryFilter.MunicipalityId = queryParams.municipality
        }

        let municipality = await models.Municipality.findByPk(queryFilter.MunicipalityId)
        if (municipality) {
            // if user requests municipality check if municipality exists and check permissions, otherwise check all permissions
            permissions.checkMunicipalityPermission(req.user, municipality.id)
        } else {
            permissions.checkCantonPermission(req.user)
        }

        if (queryParams.dateFrom && queryParams.dateFrom !== 'undefined' && queryParams.dateFrom !== 'null' &&
            queryParams.dateTo && queryParams.dateTo !== 'undefined' && queryParams.dateTo !== 'null') {
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
            attributes: GAS_ATTRIBUTES
        })

        res.json(gasApplications)
    } catch (ex) {
        res.status(404).send({error: "application list could not be retrieved", message: ex.message})
    }
})

router.get('/stats', async (req, res) => {
    try {

        let queryFilter = {}
        let queryParams = req.query
        if (queryParams.municipality && queryParams.municipality !== 'undefined' && queryParams.municipality !== 'null' && queryParams.municipality !== '0') {
            queryFilter.MunicipalityId = queryParams.municipality
        }

        let municipality = await models.Municipality.findByPk(queryFilter.MunicipalityId)
        if (municipality) {
            // if user requests municipality check if municipality exists and check permissions, otherwise check all permissions
            permissions.checkMunicipalityPermission(req.user, municipality.id)
        } else {
            permissions.checkCantonPermission(req.user)
        }

        let result = {
            open: {
                count: 0,
                generatorAreaTotal: 0,
                applicationIds: []
            },
            granted: {
                count: 0,
                generatorAreaTotal: 0,
                applicationIds: []
            },
            completed: {
                count: 0,
                generatorAreaTotal: 0,
                applicationIds: []
            }
        }

        queryFilter.status = Status.OPEN
        let openApplications = await models.GasApplication.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }],
            attributes: GAS_ATTRIBUTES
        })

        // add date filter only for granted and completed request
        if (queryParams.dateFrom && queryParams.dateFrom !== 'undefined' && queryParams.dateFrom !== 'null' &&
            queryParams.dateTo && queryParams.dateTo !== 'undefined' && queryParams.dateTo !== 'null') {
            // todo: check if user is allowed to query this municipality
            let dateFrom = new Date(queryParams.dateFrom)
            let dateTo = new Date(queryParams.dateTo)
            dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59)

            queryFilter.last_status_date = {
                [Op.gte]: dateFrom,
                [Op.lte]: dateTo,
            }
        }

        queryFilter.status = Status.GRANTED
        let grantedApplications = await models.GasApplication.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }],
            attributes: GAS_ATTRIBUTES
        })

        queryFilter.status = Status.COMPLETE
        let completedApplications = await models.GasApplication.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }],
            attributes: GAS_ATTRIBUTES
        })

        result.open.count = openApplications.length
        openApplications.forEach((application) => {
            result.open.generatorAreaTotal += parseFloat(application.generator_area)
            result.open.applicationIds.push(application)
        })

        result.granted.count = grantedApplications.length
        grantedApplications.forEach((application) => {
            result.granted.generatorAreaTotal += parseFloat(application.generator_area)
            result.granted.applicationIds.push(application)
        })

        result.completed.count = completedApplications.length
        completedApplications.forEach((application) => {
            result.completed.generatorAreaTotal += parseFloat(application.generator_area)
            result.completed.applicationIds.push(application)
        })

        res.json(result)
    } catch (ex) {
        res.status(404).send({error: "gas stats could not be retrieved", message: ex.message})
    }
})

router.get('/activities', async (req, res) => {
    try {

        let queryFilter = {}
        let queryParams = req.query
        if (queryParams.municipality && queryParams.municipality !== 'undefined' && queryParams.municipality !== 'null' && queryParams.municipality !== '0') {
            // queryFilter.MunicipalityId = queryParams.municipality
        }

        let municipality = await models.Municipality.findByPk(queryParams.municipality)
        if (municipality) {
            // if user requests municipality check if municipality exists and check permissions, otherwise check all permissions
            permissions.checkMunicipalityPermission(req.user, municipality.id)
        } else {
            permissions.checkCantonPermission(req.user)
        }

        // add date filter only for granted and completed request
        if (queryParams.dateFrom && queryParams.dateFrom !== 'undefined' && queryParams.dateFrom !== 'null' &&
            queryParams.dateTo && queryParams.dateTo !== 'undefined' && queryParams.dateTo !== 'null') {
            let dateFrom = new Date(queryParams.dateFrom)
            let dateTo = new Date(queryParams.dateTo)
            dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59)

            queryFilter.createdAt = {
                [Op.gte]: dateFrom,
                [Op.lte]: dateTo,
            }
        }

        queryFilter.application_type = 'gas'

        let gasActivities = await models.Activity.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            limit : parseInt(queryParams.limit)
        })

        // filter activities by municipality of application, if municipality filter is active
        let filteredActivities = []
        if (municipality) {
            for (const activity of gasActivities) {
                let a = await models.GasApplication.findByPk(activity.application)

                if (a.MunicipalityId === municipality.id) {
                    filteredActivities.push(activity)
                }
            }
        } else {
            filteredActivities = gasActivities
        }

        res.json(filteredActivities)
    } catch (ex) {
        res.status(404).send({error: "gas activities could not be retrieved", message: ex.message})
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
            ],
            attributes: GAS_ATTRIBUTES,
            raw: true
        })

        permissions.checkMunicipalityPermission(req.user, gasApplication.MunicipalityId)

        let applicationActivities = await models.Activity.findAll({
            where: {
                application: gasApplication.id
            },
            order: [['createdAt', 'DESC']]
        })

        gasApplication.activities = applicationActivities

        res.json(gasApplication)
    } catch (ex) {
        res.status(404).send({error: "gas application could not be retrieved", message: ex.message})
    }
})

router.get('/by_identifier/:id', async (req, res) => {
    try {

        let gasApplication = await models.GasApplication.findOne({
            where: {identifier: req.params.id},
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }
            ],
            attributes: GAS_ATTRIBUTES,
            raw: true
        })

        permissions.checkMunicipalityPermission(req.user, gasApplication.MunicipalityId)

        let applicationActivities = await models.Activity.findAll({
            where: {
                application: gasApplication.id
            },
            order: [['createdAt', 'DESC']]
        })

        gasApplication.activities = applicationActivities

        res.json(gasApplication)
    } catch (ex) {
        res.status(404).send({error: "gas application could not be retrieved", message: ex.message})
    }
})

router.patch('/:id', async (req, res) => {
    try {
        let gasApplication = await models.GasApplication.findByPk(req.params.id)

        let activityLog = []

        permissions.checkMunicipalityPermission(req.user, gasApplication.MunicipalityId)

        if ((req.body.object_egid || req.body.object_egid === '') &&
            req.body.object_egid !== gasApplication.object_egid) {
            gasApplication.object_egid = req.body.object_egid
            activityLog.push(Activity.buildGasActivity('EGID', req.user, gasApplication))
        }

        if ((req.body.object_street || req.body.object_street === '') &&
            req.body.object_street !== gasApplication.object_street) {
            gasApplication.object_street = req.body.object_street
            activityLog.push(Activity.buildGasActivity('Strasse', req.user, gasApplication))
        }

        if ((req.body.object_streetnumber || req.body.object_streetnumber === '') &&
            req.body.object_streetnumber !== gasApplication.object_streetnumber) {
            gasApplication.object_streetnumber = req.body.object_streetnumber
            activityLog.push(Activity.buildGasActivity('Hausnummer', req.user, gasApplication))
        }

        if ((req.body.object_city || req.body.object_city === '') &&
            req.body.object_city !== gasApplication.object_city) {
            gasApplication.object_city = req.body.object_city
            activityLog.push(Activity.buildGasActivity('Ort', req.user, gasApplication))
        }

        if ((req.body.object_zip || req.body.object_zip === '') &&
            req.body.object_zip !== gasApplication.object_zip) {
            gasApplication.object_zip = req.body.object_zip
            activityLog.push(Activity.buildGasActivity('PLZ', req.user, gasApplication))
        }

        if ((req.body.remark || req.body.remark === '') &&
            req.body.remark !== gasApplication.remark) {
            gasApplication.remark = req.body.remark
            activityLog.push(Activity.buildGasActivity('Bemerkung', req.user, gasApplication))
        }

        if ((req.body.gas_operator || req.body.gas_operator === '') &&
            req.body.gas_operator !== gasApplication.gas_operator) {
            gasApplication.gas_operator = req.body.gas_operator
            activityLog.push(Activity.buildGasActivity('Gasversorger', req.user, gasApplication))
        }

        if ((req.body.fuel_type || req.body.fuel_type === '') &&
            req.body.fuel_type !== gasApplication.fuel_type) {
            gasApplication.fuel_type = req.body.fuel_type
            activityLog.push(Activity.buildGasActivity('Art des Brennstoff', req.user, gasApplication))
        }

        if ((req.body.year_of_construction || req.body.year_of_construction === '') &&
            req.body.year_of_construction !== gasApplication.year_of_construction) {
            gasApplication.year_of_construction = req.body.year_of_construction
            activityLog.push(Activity.buildGasActivity('Baujahr', req.user, gasApplication))
        }

        if ((req.body.boiler_replacement_year || req.body.boiler_replacement_year === '') &&
            req.body.boiler_replacement_year !== gasApplication.boiler_replacement_year) {
            gasApplication.boiler_replacement_year = req.body.boiler_replacement_year
            activityLog.push(Activity.buildGasActivity('Datum Ersatz Heizkessel', req.user, gasApplication))
        }

        // only canton users are allowed to change municipality of an application
        if (req.body.municipality && req.body.municipality !== gasApplication.MunicipalityId) {
            permissions.checkCantonPermission(req.user)
            gasApplication.MunicipalityId = req.body.municipality
            activityLog.push(Activity.buildGasActivity('Gemeinde', req.user, gasApplication))
        }

        // status is changed -> change status on model and add the changed status as last status change date
        if (req.body.status && req.body.status !== gasApplication.status && req.body.status_date) {
            // only allow possible status
            if (Object.values(Status).includes(req.body.status)) {
                activityLog.push(Activity.buildGasActivity('Status', req.user, gasApplication, req.body.status, gasApplication.status))
                gasApplication.status = req.body.status
                gasApplication.last_status_date = new Date(req.body.status_date)

                // add new status and assigned date to object where all status dates are saved
                let statusChangeDates = gasApplication.status_changed_dates
                statusChangeDates[gasApplication.status] = gasApplication.last_status_date
                gasApplication.status_changed_dates = statusChangeDates
            }
        }

        await gasApplication.save()
        activityLog.forEach(log => log.save())

        res.status(200).send("Application updated")
    } catch (ex) {
        res.status(404).send({error: "Application could not be updated", message: ex.message})
    }
})

module.exports = router;