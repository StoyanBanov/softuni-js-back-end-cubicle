const authController = require('express').Router()
const jwt = require('jsonwebtoken')
const { login, register } = require('../services/authService')

authController.get('/login', (req, res) => {
    res.render('loginPage', {
        title: 'Login Page'
    })
})

authController.post('/login', async (req, res) => {
    try {
        const user = await login(req.body.username, req.body.password)
        req.signJwt(user)
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
})

authController.get('/register', (req, res) => {
    res.render('registerPage', {
        title: 'Register Page'
    })
})

authController.post('/register', async (req, res) => {
    try {
        if (Object.values(req.body).some(v => v == '') || req.body.password.trim() != req.body.repeatPassword.trim()) throw new Error('')
        const user = await register(req.body.username, req.body.password)
        req.signJwt(user)
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
})

authController.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.redirect('/')
})

module.exports = authController