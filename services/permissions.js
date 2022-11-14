const Roles = require("../utils/roles")

module.exports = {
    /**
     * On every application request the request has to be checked on if the user is authorized to access an application or application set
     * municipality role users can access only their own applications
     * all other roles can access all applications
     *
     * method will throw unauthorized error if user is not allow to access municipality
     */
    checkCantonPermission (user) {
        if (canAccessAllMunicipalites(user)){
            return
        }

        throw unauthorizedError()
    },
    checkMunicipalityPermission (user, municipality) {
        if (user.MunicipalityId === municipality) {
            return
        }

        if (canAccessAllMunicipalites(user)){
            return
        }

        throw unauthorizedError()
    },
    checkAllUserPermission (user) {
        if (canAccessAllUsers(user)) {
            return
        }

        throw unauthorizedError()
    },
    checkUserMunicipalityPermission (user, municipality) {
        if (canAccessAllUsers(user)) {
            return
        }

        if (canAccessMunicipalityUsers(user) && user.MunicipalityId === municipality ) {
            return
        }

        throw unauthorizedError()
    },
    checkUnconfiguredUserPermission (user) {
        if (canAccessUnconfiguredUsers(user)){
            return
        }

        throw unauthorizedError()
    }
}

// permission methods, return true/false
function canAccessAllMunicipalites(user) {
    return [Roles.CANTON_ADMIN, Roles.CANTON_USER, Roles.SITEADMIN].includes(user.role);
}

function canAccessMunicipalityUsers(user) {
    return [Roles.MUNICIPALITY_ADMIN].includes(user.role)
}

function canAccessAllUsers(user) {
    return [Roles.CANTON_ADMIN, Roles.SITEADMIN].includes(user.role)
}

function canAccessUnconfiguredUsers(user) {
    return [Roles.CANTON_ADMIN, Roles.SITEADMIN, Roles.MUNICIPALITY_ADMIN].includes(user.role)
}

function unauthorizedError() {
    let err = new Error()
    err.status = 401
    return err
}