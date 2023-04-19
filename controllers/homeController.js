const { getAllMissingAccessoriesForCube, addAccessoryToCube } = require('../services/accessoryService')
const { getAllCubicles, getCubicleById, updateCubicle, deleteCubicle } = require('../services/cubiclesService')
const { userOnly } = require('../middleware/guards');

const router = require('express').Router()

const difficulties = [{ value: "1", text: '1 - Very Easy' },
{ value: "2", text: '2 - Easy' },
{ value: "3", text: '3 - Medium (Standard 3x3)' },
{ value: "4", text: '4 - Intermediate' },
{ value: "5", text: '5 - Expert' },
{ value: "6", text: '6 - Hardcore' }]

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

router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page'
    })
})

router.get('/edit/:id', userOnly(), async (req, res) => {
    try {
        const cubicle = await getCubicleById(req.params.id)
        cubicle.difficulties = difficulties.map((o, i) => {
            if (i + 1 == cubicle.difficulty) o.selected = 'selected'
            else o.selected = ''
            return o
        })
        res.render('editCubePage', {
            title: 'Edit Page',
            cubicle
        })
    } catch (error) {
    }
})

router.post('/edit/:id', userOnly(), async (req, res) => {
    try {
        const cubicleId = req.params.id
        await updateCubicle(req.body, cubicleId)
        res.redirect('/' + cubicleId)
    } catch (error) {
        console.log(error.message);
    }
})

router.get('/delete/:id', userOnly(), async (req, res) => {
    try {
        const cubicle = await getCubicleById(req.params.id)
        cubicle.difficultyText = difficulties.find(o => o.value == cubicle.difficulty).text
        cubicle.difficulty.selected = 'selected'
        res.render('deleteCubePage', {
            title: 'Delete Page',
            cubicle
        })
    } catch (error) {
    }
})

router.post('/delete/:id', userOnly(), async (req, res) => {
    try {
        await deleteCubicle(req.params.id)
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const cubicle = await getCubicleById(req.params.id)
        if (req.user)
            cubicle.isOwner = cubicle.creatorId.toString() == req.user._id
        res.render('details', {
            title: 'Details Page',
            cubicle
        })
    } catch (error) {
        res.render('404', {
            title: 'Page Not Found'
        })
    }
})

router.use(userOnly())

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

module.exports = router