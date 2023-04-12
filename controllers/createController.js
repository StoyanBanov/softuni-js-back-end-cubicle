const { createCubicle } = require('../services/cubiclesService')
const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('create', {
        title: 'Create Page'
    })
})

router.post('/', async (req, res) => {
    try {
        const cubicle = await createCubicle(req.body)
        res.redirect('/' + cubicle.id)
    } catch (error) {

    }
})

module.exports = router