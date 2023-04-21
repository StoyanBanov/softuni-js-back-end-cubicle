const { body, validationResult } = require('express-validator')
const { createAccessory } = require('../services/accessoryService')
const { createCubicle } = require('../services/cubiclesService')
const { parseOtherErrToExpressValidatorErr, parseErr } = require('../util/errorParser')
const { difficulties } = require('../util/selectAccessory')
const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('create', {
        title: 'Create Page',
        body: {
            difficulties: difficulties.map((o, i) => {
                if (i + 1 == req.body.difficultyLevel) o.selected = 'selected'
                else o.selected = ''
                return o
            })
        }
    })
})

router.post('/',
    body(['name', 'description', 'imageUrl']).trim(),
    async (req, res) => {
        const { errors } = validationResult(req)
        try {
            const cubicle = await createCubicle(req.body, req.user._id)
            if (errors.length > 0) throw errors
            res.redirect('/' + cubicle.id)
        } catch (error) {
            if (!Array.isArray(error)) errors.push(...parseOtherErrToExpressValidatorErr(error))
            res.render('create', {
                title: 'Create Page',
                body: {
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

router.get('/accessory', (req, res) => {
    res.render('createAccessory', {
        title: 'Create Accessory'
    })
})

router.post('/accessory',
    body(['name', 'description', 'imageUrl']).trim(),
    async (req, res) => {
        const { errors } = validationResult(req)
        try {
            await createAccessory(req.body)
            if (errors.length > 0) throw errors
            res.redirect('/')
        } catch (error) {
            if (!Array.isArray(error)) errors.push(...parseOtherErrToExpressValidatorErr(error))
            res.render('createAccessory', {
                title: 'Create Accessory',
                body: {
                    name: req.body.name,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl
                },
                errorsObj: parseErr(errors)
            })
        }
    })

module.exports = router