const models = require("../models");
const Roles = require("../utils/roles");
const StatusTexts = require("../utils/statusTexts")

module.exports = {
    buildGasActivity(changedValue, user, application, newValue = null, previousValue = null) {
        let activityText = changedValue + ' geändert'

        if (changedValue === 'Status') {
            activityText = 'Status geändert von ' + StatusTexts.gas[previousValue] + ' nach ' + StatusTexts.gas[newValue]
        }

        let activity = models.Activity.build({
            changed_value: changedValue,
            changed_by: user.fullname,
            activity_text: activityText,
            application: application.id,
            application_type: 'gas',
            identifier: application.identifier
        })

        return activity
    },

    buildPvActivity(changedValue, user, application, newValue = null, previousValue = null) {
        let activityText = changedValue + ' geändert'

        if (changedValue === 'Status') {
            activityText = 'Status geändert von ' + StatusTexts.pv[previousValue] + ' nach ' + StatusTexts.pv[newValue]
        }

        let activity = models.Activity.build({
            changed_value: changedValue,
            changed_by: user.fullname,
            activity_text: activityText,
            application: application.id,
            application_type: 'pv',
            identifier: application.identifier
        })

        return activity
    }
}