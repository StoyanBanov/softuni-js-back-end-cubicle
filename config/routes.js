const homeController = require('../controllers/homeController')
const createController = require('../controllers/createController');

module.exports = app => {
    app.use('/create', createController)
    app.use(homeController)
}