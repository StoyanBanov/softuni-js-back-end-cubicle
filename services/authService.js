const User = require('../models/User')
const bcrypt = require('bcrypt')

async function login(username, password) {
    const user = await User.findOne({ 'username': username })
    if (user && await bcrypt.compare(password, user.password))
        return {
            _id: user._id,
            username
        }
    else throw new Error('Wrong username or password')
}

async function register(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
        username: username,
        password: hashedPassword
    })
    await user.save()
    return {
        _id: user._id,
        username
    }
}

module.exports = {
    login,
    register
}