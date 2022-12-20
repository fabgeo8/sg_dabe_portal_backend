const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const Status = require("../utils/status");
const permissions = require("../services/permissions");
const Activity = require("../services/activities");

const PV_ATTRIBUTES = ['id', 'MunicipalityId', 'createdAt', 'identifier', 'version', 'object_egid', 'object_street', 'object_streetnumber', 'object_zip', 'object_city', 'address', 'object_plot', 'generator_area', 'fee', 'status', 'remark', 'status_changed_dates', 'last_status_date', 'cleared', 'cleared_date']

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
            permissions.checkMunicipalityPermission(req.user, municipality.id )
        } else {
            permissions.checkCantonPermission(req.user)
        }

        if (queryParams.dateFrom && queryParams.dateFrom !== 'undefined' && queryParams.dateFrom !== 'null' &&
            queryParams.dateTo && queryParams.dateTo !== 'undefined' && queryParams.dateTo !== 'null'){
            // todo: check if user is allowed to query this municipality
            let dateFrom = new Date(queryParams.dateFrom)
            let dateTo = new Date(queryParams.dateTo)
            dateTo = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 23, 59, 59)

            queryFilter.createdAt = {
                [Op.gte]: dateFrom,
                [Op.lte]: dateTo,
            }
        }

        let pvApplications = await models.PvApplication.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }],
            attributes: PV_ATTRIBUTES
        })

        res.json(pvApplications)
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
            permissions.checkMunicipalityPermission(req.user, municipality.id )
        } else {
            permissions.checkCantonPermission(req.user)
        }

        let result = {
            open: {
                count: 0,
                feeTotal: 0,
                generatorAreaTotal: 0,
                applicationIds: []
            },
            granted: {
                count: 0,
                feeTotal: 0,
                generatorAreaTotal: 0,
                applicationIds: []
            },
            completed: {
                count: 0,
                feeTotal: 0,
                generatorAreaTotal: 0,
                applicationIds: []
            },
            cleared: {
                count: 0,
                feeTotal: 0,
                generatorAreaTotal: 0,
                applicationIds: []
            }
        }

        queryFilter.status = Status.OPEN
        let openApplications = await models.PvApplication.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }],
            attributes: PV_ATTRIBUTES
        })

        if (queryParams.dateFrom && queryParams.dateFrom !== 'undefined' && queryParams.dateFrom !== 'null' &&
            queryParams.dateTo && queryParams.dateTo !== 'undefined' && queryParams.dateTo !== 'null'){
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
        let grantedApplications = await models.PvApplication.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }],
            attributes: PV_ATTRIBUTES
        })

        queryFilter.status = Status.COMPLETE
        let completedApplications = await models.PvApplication.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }],
            attributes: PV_ATTRIBUTES
        })

        queryFilter.status = Status.COMPLETE
        queryFilter.cleared = true
        let clearedApplications = await models.PvApplication.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }],
            attributes: PV_ATTRIBUTES
        })

        result.open.count = openApplications.length
        openApplications.forEach((application) => {
            result.open.feeTotal += application.fee
            result.open.generatorAreaTotal += parseFloat(application.generator_area)
            result.open.applicationIds.push(application)
        })

        result.granted.count = grantedApplications.length
        grantedApplications.forEach((application) => {
            result.granted.feeTotal += application.fee
            result.granted.generatorAreaTotal += parseFloat(application.generator_area)
            result.granted.applicationIds.push(application)
        })

        result.completed.count = completedApplications.length
        completedApplications.forEach((application) => {
            result.completed.feeTotal += application.fee
            result.completed.generatorAreaTotal += parseFloat(application.generator_area)
            result.completed.applicationIds.push(application)
        })

        result.cleared.count = clearedApplications.length
        clearedApplications.forEach((application) => {
            result.cleared.feeTotal += application.fee
            result.cleared.generatorAreaTotal += parseFloat(application.generator_area)
            result.cleared.applicationIds.push(application)
        })

        res.json(result)
    } catch (ex) {
        res.status(404).send({error: "pv stats could not be retrieved", message: ex.message})
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

        queryFilter.application_type = 'pv'

        let applicationFilter = {}
        if (municipality) {
            applicationFilter = {
                MunicipalityId: municipality.id
            }
        }

        let pvActivities = await models.Activity.findAll({
            order: [['createdAt', 'DESC']],
            where: queryFilter,
            limit : parseInt(queryParams.limit),
            include: {
                model: models.PvApplication,
                where: applicationFilter,
                attributes: ['MunicipalityId']
            }
        })

        res.json(pvActivities)
    } catch (ex) {
        res.status(404).send({error: "gas activities could not be retrieved", message: ex.message})
    }
})

router.get('/:id', async (req, res) => {
    try {

        let pvApplication = await models.PvApplication.findByPk(req.params.id, {
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }
            ],
            attributes: PV_ATTRIBUTES,
            raw: true
        })

        permissions.checkMunicipalityPermission(req.user, pvApplication.MunicipalityId)

        let applicationActivities = await models.Activity.findAll({
            where: {
                application: pvApplication.id
            },
            order: [['createdAt', 'DESC']]
        })

        pvApplication.activities = applicationActivities

        res.json(pvApplication)
    } catch (ex) {
        res.status(404).send({error: "gas application could not be retrieved", message: ex.message})
    }
})

router.get('/by_identifier/:id', async (req, res) => {
    try {

        let pvApplication = await models.PvApplication.findOne({
            where: {identifier: req.params.id},
            include: [
                {
                    model: models.Municipality,
                    attributes: ['name'],
                    required: true
                }
            ],
            attributes: PV_ATTRIBUTES,
            raw: true
        })

        permissions.checkMunicipalityPermission(req.user, pvApplication.MunicipalityId)

        let applicationActivities = await models.Activity.findAll({
            where: {
                application: pvApplication.id
            },
            order: [['createdAt', 'DESC']]
        })

        pvApplication.activities = applicationActivities

        res.json(pvApplication)
    } catch (ex) {
        res.status(404).send({error: "gas application could not be retrieved", message: ex.message})
    }
})

router.post('/clear_applications', async (req, res) => {
    try {
        permissions.checkCantonPermission(req.user)

        let activityLog = []

        let applications = req.body.applications

        for (const application of applications) {
            let a = await models.PvApplication.findByPk(application.id)
            if (!a.cleared) {
                a.cleared = true
                a.cleared_date = new Date()
                await a.save()

                activityLog.push(Activity.buildPvActivity('Abgerechnet', req.user, a))
            }
        }

        res.status(200).json({ message: 'applications updated'})
        activityLog.forEach((a) => a.save())

    } catch (ex) {
        res.status(404).send({error: "applications could not be updated", message: ex.message})
    }
})

router.patch('/:id', async (req, res) => {
    try {
        let pvApplication = await models.PvApplication.findByPk(req.params.id)

        let activityLog = []

        permissions.checkMunicipalityPermission(req.user, pvApplication.MunicipalityId)

        if ((req.body.object_egid || req.body.object_egid === '') &&
            req.body.object_egid !== pvApplication.object_egid) {
            pvApplication.object_egid = req.body.object_egid
            activityLog.push(Activity.buildPvActivity('EGID', req.user, pvApplication))
        }

        if ((req.body.object_street || req.body.object_street === '') &&
            req.body.object_street !== pvApplication.object_street) {
            pvApplication.object_street = req.body.object_street
            activityLog.push(Activity.buildPvActivity('Strasse', req.user, pvApplication))
        }

        if ((req.body.object_streetnumber || req.body.object_streetnumber === '') &&
            req.body.object_streetnumber !== pvApplication.object_streetnumber) {
            pvApplication.object_streetnumber = req.body.object_streetnumber
            activityLog.push(Activity.buildPvActivity('Hausnummer', req.user, pvApplication))
        }

        if ((req.body.object_city || req.body.object_city === '') &&
            req.body.object_city !== pvApplication.object_city) {
            pvApplication.object_city = req.body.object_city
            activityLog.push(Activity.buildPvActivity('Ort', req.user, pvApplication))
        }

        if ((req.body.object_zip || req.body.object_zip === '') &&
            req.body.object_zip !== pvApplication.object_zip) {
            pvApplication.object_zip = req.body.object_zip
            activityLog.push(Activity.buildPvActivity('PLZ', req.user, pvApplication))
        }

        if ((req.body.remark || req.body.remark === '') &&
            req.body.remark !== pvApplication.remark) {
            pvApplication.remark = req.body.remark
            activityLog.push(Activity.buildPvActivity('Bemerkung', req.user, pvApplication))
        }

        // only canton users are allowed to change municipality of an application
        if (req.body.municipality && req.body.municipality !== pvApplication.MunicipalityId) {
            permissions.checkCantonPermission(req.user)
            pvApplication.MunicipalityId = req.body.municipality
            activityLog.push(Activity.buildPvActivity('Gemeinde', req.user, pvApplication))
        }

        // only canton users are allowed to change cleared state of a pv application
        if ((req.body.cleared === true || req.body.cleared === false )
            && req.body.cleared !== pvApplication.cleared) {
            permissions.checkCantonPermission(req.user)
            if (req.body.cleared === true) {
                if (req.body.cleared_date) {
                    pvApplication.cleared = req.body.cleared
                    pvApplication.cleared_date = req.body.cleared_date
                    // todo: michi was machen wir mit datum status
                    // activityLog.push(Activity.buildPvActivity('Abrechnungsdatum', req.user, pvApplication))
                }
            } else {
                pvApplication.cleared = false
                pvApplication.cleared_date = null
            }

            activityLog.push(Activity.buildPvActivity('Abgerechnet', req.user, pvApplication))
        } else if (req.body.cleared_date && req.body.cleared_date !== pvApplication.cleared_date) {
            permissions.checkCantonPermission(req.user)
            pvApplication.cleared_date = req.body.cleared_date
            activityLog.push(Activity.buildPvActivity('Abrechnungsdatum', req.user, pvApplication))
        }

        // status is changed -> change status on model and add the changed status as last status change date
        if (req.body.status && req.body.status !== pvApplication.status && req.body.status_date) {
            // only allow possible status
            if (Object.values(Status).includes(req.body.status)) {
                activityLog.push(Activity.buildPvActivity('Status', req.user, pvApplication, req.body.status, pvApplication.status))
                pvApplication.status = req.body.status
                pvApplication.last_status_date = new Date(req.body.status_date)

                // add new status and assigned date to object where all status dates are saved
                let statusChangeDates = pvApplication.status_changed_dates
                statusChangeDates[pvApplication.status] = pvApplication.last_status_date
                pvApplication.status_changed_dates = statusChangeDates
            }
        } else if (req.body.status_date && req.body.status_date !== pvApplication.last_status_date) {
            // case when only status date is changed but not the date
            pvApplication.last_status_date = new Date(req.body.status_date)
            activityLog.push(Activity.buildGasActivity('Statusdatum', req.user, pvApplication))

            // add new status and assigned date to object where all status dates are saved
            let statusChangeDates = pvApplication.status_changed_dates
            statusChangeDates[pvApplication.status] = pvApplication.last_status_date
            pvApplication.status_changed_dates = statusChangeDates
        }

        await pvApplication.save()
        activityLog.forEach(log => log.save())

        res.status(200).send("Application updated")
    } catch (ex) {
        res.status(404).send({error: "Application could not be updated", message: ex.message})
    }
})




module.exports = router;