const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
})

const User = model('User', schema)

module.exports = User