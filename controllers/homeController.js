const { getAllCubicles, getCubicleById } = require('../services/cubiclesService')

const router = require('express').Router()

router.get('/', (req, res) => {
    const search = req.query.search || ''
    const from = Number(req.query.from) || 0
    const to = Number(req.query.to) || 6
    const cubicles = getAllCubicles(search, from, to)
    res.render('index', {
        title: 'Cubicle Service',
        cubicles,
        search,
        from,
        to
    })
})

router.get('/:id', (req, res) => {
    const cubicle = getCubicleById(req.params.id)
    res.render('details', {
        title: 'Details Page',
        cubicle
    })
})

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page'
    })
})

router.all('/*', (req, res) => {
    res.render('404', {
        title: 'Page Not Found'
    })
})

module.exports = router