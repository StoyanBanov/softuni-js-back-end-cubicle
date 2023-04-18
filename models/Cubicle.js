const { Schema, model, Types: { ObjectId } } = require('mongoose')

const schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true, maxLength: 200 },
    imageUrl: { type: String, required: true },
    difficulty: { type: Number, required: true, min: 1, max: 6 },
    accessories: { type: [ObjectId], default: [], ref: 'Accessory' },
    creatorId: { type: ObjectId, required: true }
})

schema.path('imageUrl').validate(function () {
    return this.imageUrl.startsWith('https') || this.imageUrl.startsWith('http')
}, 'Invalid image url')

const Cubicle = model('Cubicle', schema)

module.exports = Cubicle