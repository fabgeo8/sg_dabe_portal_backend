const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const Status = require("../utils/status");
const Roles = require("../utils/roles");

const cantonLocation = 'canton';

const accessableUserAttributes = ['fullname', 'id', 'email', 'createdAt', 'role', 'role_name']

/*
 * User routes for canton users access
 */
router.get('/canton', async (req, res) => {
    try {
        let users = await models.User.findAll({
            order: [['createdAt', 'DESC']],
            where: {
                MunicipalityId: null,
                role: {
                    [Op.in]: [Roles.CANTON_USER, Roles.CANTON_ADMIN]
                },
                is_authorized: true
            },
            attributes: accessableUserAttributes
        })

        res.json(users)
    } catch (ex) {
        res.status(404).send({error: "user list could not be retrieved", message: ex.message})
    }
})

/*
 * get users that are not assigned to a municipality or canton
 */
router.get('/unauthorized', async (req, res) => {
    try {
        let users = await models.User.findAll({
            order: [['createdAt', 'DESC']],
            where: {is_authorized: false},
            attributes: accessableUserAttributes
        })

        res.json(users)
    } catch (ex) {
        res.status(404).send({error: "user list could not be retrieved", message: ex.message})
    }
})

/*
 * get users that are not assigned to a municipality or canton
 */
router.get('/me', async (req, res) => {
    try {
        let users = await models.User.findAll({
            order: [['createdAt', 'DESC']],
            where: {is_authorized: false},
            attributes: accessableUserAttributes
        })

        res.json(users)
    } catch (ex) {
        res.status(404).send({error: "user list could not be retrieved", message: ex.message})
    }
})

/*
 * User routes for municipality access
 */
router.get('/me', async (req, res) => {
    try {
        let user = await models.User.findByPk(req.params.userId,
            {
                attributes: ["fullname", "email", "is_authorized", "MunicipaliyId"]
            })

        res.json(user)
    } catch (ex) {
        res.status(404).send({error: "user could not be retrieved", message: ex.message})
    }
})

router.patch('/:userId/set_authorized', async (req, res) => {
    try {
        let user = await models.User.findByPk(req.params.userId)

        if (req.body.userLocation) {
            // user location is either municipalityid for municipality users or 'canton' for canton users
            if (req.body.userLocation === cantonLocation) {
                // user is being set active as canton user, check permissions
                user.role = Roles.CANTON_USER
                user.is_authorized = true
                user.MunicipalityId = null
            } else {
                // check if municipality exists and user has permission
                let municipality = await models.Municipality.findByPk(req.body.userLocation)
                // check permission

                user.MunicipalityId = municipality.id
                user.role = Roles.MUNICIPALITY_USER
                user.is_authorized = true
            }
        }

        await user.save()

        res.status(200).send("user updated")
    } catch (ex) {
        res.status(404).send({error: "user could not be updated", message: ex.message})
    }
})

router.patch('/:userId/set_unauthorized', async (req, res) => {
    try {
        let user = await models.User.findByPk(req.params.userId)

        // check permissions to deactivate this user based on its role and municipality
        user.role = null
        user.MunicipalityId = null
        user.is_authorized = false

        await user.save()

        res.status(200).send("user updated")
    } catch (ex) {
        res.status(404).send({error: "user could not be updated", message: ex.message})
    }
})

router.patch('/:userId', async (req, res) => {
    try {
        let user = await models.User.findByPk(req.params.userId)

        /* only role is allowed to patch
        * role can only be patched as admin and can only be set to user/admin in either canton or municipality
        * desired role parameter is in string
        */

        if (req.body.role) {
            let requestedRole = req.body.role.toLowerCase()

            // check if user is municipality user or not
            if (user.MunicipalityId === null && [Roles.CANTON_USER, Roles.CANTON_ADMIN].includes(user.role)) {
                // user is canton user
                if (requestedRole === 'admin') {
                    user.role = Roles.CANTON_ADMIN
                } else if (requestedRole === 'user') {
                    user.role = Roles.CANTON_USER
                }
            }
            else {
                // user is municipality user
                if (requestedRole === 'admin') {
                    user.role = Roles.MUNICIPALITY_ADMIN
                } else if (requestedRole === 'user') {
                    user.role = Roles.MUNICIPALITY_USER
                }
            }
        }

        await user.save()

        res.status(200).send("user updated")
    } catch (ex) {
        res.status(404).send({error: "user could not be updated", message: ex.message})
    }
})




module.exports = router;