const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true, maxLength: 200 },
    cubes: { type: [ObjectId], default: [], ref: 'Cubicle' }
})

schema.path('imageUrl').validate(function () {
    return this.imageUrl.startsWith('https') || this.imageUrl.startsWith('http')
}, 'Invalid image url')

const Accessory = model('Accessory', schema)

module.exports = Accessory