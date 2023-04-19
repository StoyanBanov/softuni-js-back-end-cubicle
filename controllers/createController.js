const { createAccessory } = require('../services/accessoryService')
const { createCubicle } = require('../services/cubiclesService')
const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('create', {
        title: 'Create Page'
    })
})

router.post('/', async (req, res) => {
    try {
        const cubicle = await createCubicle(req.body, req.user._id)
        res.redirect('/' + cubicle.id)
    } catch (error) {

    }
})

router.get('/accessory', (req, res) => {
    res.render('createAccessory', {
        title: 'Create Accessory'
    })
})

router.post('/accessory', async (req, res) => {
    try {
        await createAccessory(req.body)
        res.redirect('/')
    } catch (error) {

    }
})

module.exports = router