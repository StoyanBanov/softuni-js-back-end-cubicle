const express = require('express')
const hbs = require('express-handlebars').create({
    extname: '.hbs'
})
const port = 3000
const homeController = require('./controllers/homeController')
const createController = require('./controllers/createController')

app = express()
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static('static'))

app.use('/create', createController)
app.use(homeController)

app.listen(port)