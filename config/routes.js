const homeController = require('../controllers/homeController')
const createController = require('../controllers/createController');
const { userOnly } = require('../middleware/guards');
const authController = require('../controllers/authController');

module.exports = app => {
    app.use('/create', userOnly(), createController)
    app.use(authController)
    app.use(homeController)
    app.all('/*', (req, res) => {
        res.render('404', {
            title: 'Page Not Found'
        })
    })
}