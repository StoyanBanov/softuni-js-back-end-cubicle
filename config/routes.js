const homeController = require('../controllers/homeController')
const createController = require('../controllers/createController');
const authController = require('../controllers/authController')

module.exports = app => {
    app.use('/create', createController)
    app.use('/auth', authController)
    app.use(homeController)
}