const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: {
        type: String, minLength: [5, 'The username must be at least 5 characters long!'],
        validate: { validator: v => /^[A-Za-z\d]{5,}$/g.test(v), message: props => `${props.value} is not valid! The username should contain only english letters and numbers!` }
    },
    password: {
        type: String, required: true
    }
})

schema.index({ username: 1 }, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 3,
    }
})

const User = model('User', schema)

module.exports = User