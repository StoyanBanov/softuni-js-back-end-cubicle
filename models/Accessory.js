const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    name: {
        type: String, minLength: [5, 'The name must be at least 5 characters long!'],
        validate: { validator: (value) => /^[A-Za-z\d ]{5,}$/g.test(value), message: (props) => `${props.value} is not a valid name! It can contain only eng letters, digits and white spaces!` }
    },
    imageUrl: { type: String },
    description: {
        type: String, minLength: [5, 'The name must be at least 5 characters long!'],
        validate: { validator: (value) => /^[A-Za-z\d ]{5,}$/g.test(value), message: (props) => `The description can contain only eng letters, digits and white spaces!` }
    },
    cubes: { type: [ObjectId], default: [], ref: 'Cubicle' }
})

schema.path('imageUrl').validate(function () {
    return this.imageUrl.startsWith('https') || this.imageUrl.startsWith('http')
}, 'Invalid image url')

const Accessory = model('Accessory', schema)

module.exports = Accessory