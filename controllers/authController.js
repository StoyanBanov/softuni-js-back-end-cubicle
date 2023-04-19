const authController = require('express').Router()
const { guestOnly, userOnly } = require('../middleware/guards')
const { login, register } = require('../services/authService')

authController.get('/logout', userOnly(), (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/')
})

authController.get('/login', guestOnly(), (req, res) => {
    res.render('loginPage', {
        title: 'Login Page'
    })
})

authController.post('/login', guestOnly(), async (req, res) => {
    try {
        const user = await login(req.body.username, req.body.password)
        req.signJwt(user)
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
})

authController.get('/register', guestOnly(), (req, res) => {
    res.render('registerPage', {
        title: 'Register Page'
    })
})

authController.post('/register', guestOnly(), async (req, res) => {
    try {
        if (Object.values(req.body).some(v => v == '') || req.body.password.trim() != req.body.repeatPassword.trim()) throw new Error('')
        const user = await register(req.body.username, req.body.password)
        req.signJwt(user)
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
})

authController.all('/*', (req, res, next) => {
    next()
})

module.exports = authController