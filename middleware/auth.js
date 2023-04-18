const jwt = require('jsonwebtoken')

module.exports = (jwtSecret) => (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        try {
            const data = jwt.verify(token, jwtSecret)
            req.user = data
        } catch (error) {
            res.clearCookie('jwt')
            res.redirect('/auth/login')
        }
    }
    req.signJwt = payload => {
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '4h' })
        res.cookie('jwt', token, { maxAge: 1400000 })
    }
    next()
}