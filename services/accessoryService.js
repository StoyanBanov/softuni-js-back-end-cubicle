const Accessory = require('../models/Accessory')
const Cubicle = require('../models/Cubicle')

async function createAccessory(data) {
    const accessory = new Accessory({
        "name": data.name,
        "description": data.description,
        "imageUrl": data.imageUrl
    })
    await accessory.save()
}

async function getAllMissingAccessoriesForCube(cubeId) {
    return (await Accessory.find({}).lean()).filter(a => a.cubes.every(c => c.toString() != cubeId))
}

async function addAccessoryToCube(accessoryId, cubeId) {
    const cube = await Cubicle.findById(cubeId)
    cube.accessories.push(accessoryId)
    cube.save();
    const accessory = await Accessory.findById(accessoryId)
    accessory.cubes.push(cubeId)
    accessory.save()
}

module.exports = {
    createAccessory,
    getAllMissingAccessoriesForCube,
    addAccessoryToCube
}