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

module.exports = {
    guestOnly,
    userOnly
}