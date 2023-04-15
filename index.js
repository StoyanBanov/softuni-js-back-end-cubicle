const express = require('express')
const expressConfig = require('./config/express')
const routesConfig = require('./config/routes')
const databaseConfig = require('./config/database')

const port = 3000

async function start() {
    const app = express()
    await databaseConfig(app)
    expressConfig(app)
    routesConfig(app)
    app.listen(port)
}
start()