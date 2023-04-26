const guestOnly = () => (req, res, next) => {
    if (req.user) {
        return res.redirect('/')
    }
    next()
}

const userOnly = () => (req, res, next) => {
    if (!req.user) {
        return res.redirect('/')
    }
    next()
}

function ownerOnly(creatorId) {
    return (req, res, next) => {
        if (req.user._id != creatorId) {
            return res.redirect('/')
        }
        next()
    }
}

module.exports = {
    guestOnly,
    userOnly,
    ownerOnly
}