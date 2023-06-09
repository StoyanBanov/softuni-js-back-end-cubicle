const authController = require('express').Router()
const { body, validationResult } = require('express-validator')
const { guestOnly, userOnly } = require('../middleware/guards')
const { login, register } = require('../services/authService')
const { parseErr, parseOtherErrToExpressValidatorErr } = require('../util/errorParser')

authController.get('/logout', userOnly(), (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/')
})

authController.get('/login', guestOnly(), (req, res) => {
    res.render('loginPage', {
        title: 'Login Page'
    })
})

authController.post('/login', guestOnly(),
    body(['username', 'password', 'repeatPassword']).trim(),
    async (req, res) => {
        const { errors } = validationResult(req)
        try {
            const user = await login(req.body.username, req.body.password)
            req.signJwt(user)
            if (errors.length > 0) throw errors
            res.redirect('/')
        } catch (error) {
            if (!Array.isArray(error)) errors.push(...parseOtherErrToExpressValidatorErr(error))
            res.render('loginPage', {
                title: 'Login Page',
                errorsObj: parseErr(errors)
            })
        }
    })

authController.get('/register', guestOnly(), (req, res) => {
    res.render('registerPage', {
        title: 'Register Page'
    })
})

authController.post('/register', guestOnly(),
    body(['username', 'password', 'repeatPassword']).trim(),
    body('password')
        .isLength(8).withMessage('The password must be at least 8 characters long!')
        .isAlphanumeric().withMessage('The password must contain only english letters and numbers!'),
    body('repeatPassword')
        .custom((v, { req }) => req.body.password == v)
        .withMessage('Passwords don\'t match!'),
    async (req, res) => {
        const { errors } = validationResult(req)
        try {
            if (errors.length > 0) throw errors
            const user = await register(req.body.username, req.body.password)
            req.signJwt(user)
            res.redirect('/')
        } catch (error) {
            if (!Array.isArray(error)) errors.push(...parseOtherErrToExpressValidatorErr(error))
            res.render('registerPage', {
                title: 'Register Page',
                errorsObj: parseErr(errors),
                body: {
                    username: req.body.username
                }
            })
        }
    })

authController.all('/*', (req, res, next) => {
    next()
})

module.exports = authController