const express = require('express');
const router = express.Router();
const models = require('../models')
const { Op } = require("sequelize");

router.post('/', async (req, res) => {

    try {
        let operator = await models.Operator.create({
            name: req.body.name,
            street: req.body.street,
            zip: req.body.zip,
            city: req.body.city
        })

        res.status(204).json(operator)
    } catch {
        res.status(404);
        res.send({error: "operator not created"})
    }
})

router.post('/:id/locations', async (req, res) => {
    try {
        let eventLocation = await models.EventLocation.build({
            street: req.body.street,
            zip: req.body.zip,
            city: req.body.city,
            contact: req.body.contact,
            phone: req.body.phone
        })

        let operator = await models.Operator.findByPk(req.params.id);

        eventLocation.setOperator(operator);
        await eventLocation.save();

        res.status(204).json(eventLocation);
    } catch (err) {
        res.status(404);
        res.send({error: "location not created", msg: err.message})
    }
})

router.get('/:id/locations', async (req, res) => {
    try {
        let events = await models.EventLocation.findAll({
            where: {
                OperatorId: req.params.id
            },
            attributes: ['id', 'street', 'city', 'zip', 'address', 'contact', 'phone']
        })

        res.json(events)
    } catch {
        res.status(404).send({error: "location list could not be retrieved"})
    }
})

router.delete('/:id/locations/:locationId', async (req, res) => {
    try {
        let location = await models.EventLocation.findByPk(req.params.locationId)

        await location.destroy()

        res.status(204).send('location removed')
    } catch {
        res.status(404).send({error: "location could not be removed"})
    }
})

router.get('/:id/events', async (req, res) => {
    try {
        let events = await models.Event.findAll({
            where: {
                title: {
                    [Op.ne]: null
                }
            },
            include: [models.EventLocation],
            attributes: ['id', 'title', 'startDate', 'endDate', 'active', 'courseLevel', 'operatorReference', 'aimedAt']
        })

        res.json(events)
    } catch (err) {
        res.status(404).send({error: "event list could not be retrieved", message: err.message})
    }
})

router.delete('/:id/events/:eventId', async (req, res) => {
    try {
        let event = await models.Event.findByPk(req.params.eventId)

        await event.destroy()

        res.status(204).send('event removed')
    } catch (err)
    {
        console.log(err.message)
        res.status(404).send({error: "event could not be removed", message: err.message})
    }
})

router.post('/:id/events', async (req, res) => {
    try {
        let event = await models.Event.build({
            title: req.body.title,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            courseLevel: req.body.courseLevel,
            hasFideCertificacte: req.body.hasFideCertificacte,
            hasChildSupervision: req.body.hasChildSupervision,
            aimedAt: req.body.aimedAt,
            operatorReference: req.body.totalCosts
        })

        let eventLocation = await models.EventLocation.findByPk(req.body.eventLocation);

        event.setEventLocation(eventLocation);

        await event.save()

        res.status(204).json(event)
    } catch {
        res.status(404).send({error: "event could not be created"})
    }
})

module.exports = router;