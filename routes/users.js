const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const Status = require("../utils/status");

const accessableUserAttributes = ['fullname', 'id', 'email', 'createdAt' ]

/*
 * User routes for municipality access
 */
router.get('/', async (req, res) => {
    try {

        let users = await models.User.findAll({
            order: [['createdAt', 'DESC']],
            attributes: accessableUserAttributes
        })

        res.json(users)
    } catch (ex) {
        res.status(404).send({error: "user list could not be retrieved", message: ex.message})
    }
})



module.exports = router;