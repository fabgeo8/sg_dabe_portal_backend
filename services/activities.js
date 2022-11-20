const models = require("../models");
const Roles = require("../utils/roles");

module.exports = {
    buildGasActivity(changedValue, user, application, newValue = null, previousValue = null) {
        let activityText = changedValue + ' geändert'

        if (changedValue === 'Status') {
            activityText = 'Status geändert von ' + previousValue + ' nach ' + newValue
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
            activityText = 'Status geändert von ' + previousValue + ' nach ' + newValue
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