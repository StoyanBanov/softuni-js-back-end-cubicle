const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    name: {
        type: String, required: [true, 'The name is required!'], minLength: [5, 'The name must be at least 5 characters long!'],
        validate: { validator: (value) => /^[A-Za-z\d ]{5,}$/g.test(value), message: (props) => `${props.value} is not a valid name! It can contain only eng letters, digits and white spaces!` }
    },
    description: {
        type: String, required: [true, 'The description is required!'], minLength: [20, 'The description must be at least 20 characters long!'],
        validate: { validator: (value) => /^[A-Za-z\d ]{5,}$/g.test(value), message: (props) => `The description can contain only eng letters, digits and white spaces!` }
    },
    imageUrl: { type: String, required: [true, 'The imageUrl is required!'] },
    difficulty: { type: Number, required: [true, 'The difficulty is required!'], min: [1, 'The difficulty cannot be less than 1'], max: [6, 'The difficulty cannot be more than 6'] },
    accessories: { type: [ObjectId], default: [], ref: 'Accessory' },
    creatorId: { type: ObjectId, required: true }
})

schema.path('imageUrl').validate(function () {
    return this.imageUrl.startsWith('https') || this.imageUrl.startsWith('http')
}, 'Invalid image url')

const Cubicle = model('Cubicle', schema)

module.exports = Cubicle