const { getAllMissingAccessoriesForCube, addAccessoryToCube } = require('../services/accessoryService')
const { getAllCubicles, getCubicleById } = require('../services/cubiclesService')

const router = require('express').Router()

router.get('/', async (req, res) => {
    const search = req.query.search || ''
    const from = Number(req.query.from) || 0
    const to = Number(req.query.to) || 6
    const cubicles = await getAllCubicles(search, from, to)
    res.render('index', {
        title: 'Cubicle Service',
        cubicles,
        search,
        from,
        to
    })
})

router.get('/:id', async (req, res) => {
    const cubicle = await getCubicleById(req.params.id)
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

router.get('/attach/accessory/:cubeId', async (req, res) => {
    const cubeId = req.params.cubeId
    const accessories = await getAllMissingAccessoriesForCube(cubeId)
    res.render('attachAccessory', {
        title: 'Attach Accessory',
        accessories,
        cubeId
    })
})

router.post('/attach/accessory/:cubeId', async (req, res) => {
    try {
        await addAccessoryToCube(req.body.accessory, req.params.cubeId)
        res.redirect(`/attach/accessory/${req.params.cubeId}`)
    } catch (error) {

    }
})


router.all('/*', (req, res) => {
    res.render('404', {
        title: 'Page Not Found'
    })
})

module.exports = router