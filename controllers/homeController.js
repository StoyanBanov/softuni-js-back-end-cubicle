const { getAllMissingAccessoriesForCube, addAccessoryToCube } = require('../services/accessoryService')
const { getAllCubicles, getCubicleById, updateCubicle, deleteCubicle } = require('../services/cubiclesService')
const { userOnly } = require('../middleware/guards');
const { body, validationResult } = require('express-validator');
const { parseErr, parseOtherErrToExpressValidatorErr } = require('../util/errorParser');

const router = require('express').Router()

const { difficulties } = require('../util/selectAccessory')

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
        res.render('404', {
            title: 'Page Not Found'
        })
    }
})

router.post('/edit/:id', userOnly(),
    body(['name', 'description', 'imageUrl']).trim(),
    async (req, res) => {
        const { errors } = validationResult(req)
        const cubicleId = req.params.id
        try {
            await updateCubicle(req.body, cubicleId)
            res.redirect('/' + cubicleId)
        } catch (error) {
            if (!Array.isArray(error)) errors.push(...parseOtherErrToExpressValidatorErr(error))
            res.render('editCubePage', {
                title: 'Edit Page',
                cubicle: {
                    _id: cubicleId,
                    name: req.body.name,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl,
                    difficulties: difficulties.map((o, i) => {
                        if (i + 1 == req.body.difficultyLevel) o.selected = 'selected'
                        else o.selected = ''
                        return o
                    })
                },
                errorsObj: parseErr(errors)
            })
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
        res.render('404', {
            title: 'Page Not Found'
        })
    }
})

router.post('/delete/:id', userOnly(), async (req, res) => {
    try {
        await deleteCubicle(req.params.id)
        res.redirect('/')
    } catch (error) {
        res.render('404', {
            title: 'Page Not Found'
        })
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
    try {
        const cubeId = req.params.cubeId
        const accessories = await getAllMissingAccessoriesForCube(cubeId)
        res.render('attachAccessory', {
            title: 'Attach Accessory',
            accessories,
            cubeId
        })
    } catch (error) {
        res.render('404', {
            title: 'Page Not Found'
        })
    }
})

router.post('/attach/accessory/:cubeId', async (req, res) => {
    try {
        await addAccessoryToCube(req.body.accessory, req.params.cubeId)
        res.redirect(`/attach/accessory/${req.params.cubeId}`)
    } catch (error) {
        res.render('404', {
            title: 'Page Not Found'
        })
    }
})

module.exports = router