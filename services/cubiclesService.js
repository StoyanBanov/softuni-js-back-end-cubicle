//const fs = require('fs')
//const dataDir = './models/data.json'
const Cubicle = require('../models/Cubicle')

async function getAllCubicles(search, from, to) {
    const data = await Cubicle.find({}).lean()
    search = search.toLowerCase()
    return data.filter(c => c.name.toLowerCase().includes(search) || c.description.toLowerCase().includes(search))
        .filter(({ difficulty }) => difficulty >= from && difficulty <= to)
}

async function getCubicleById(id) {
    return Cubicle.findById(id).populate('accessories').lean()
}

async function createCubicle(CubicleData, creatorId) {
    const cubicle = new Cubicle({
        "name": CubicleData.name,
        "description": CubicleData.description,
        "imageUrl": CubicleData.imageUrl,
        "difficulty": Number(CubicleData.difficultyLevel),
        "creatorId": creatorId
    })
    await cubicle.save()
    return cubicle
}

async function updateCubicle(CubicleData, id) {
    const cubicle = await Cubicle.findById(id)
    cubicle["name"] = CubicleData.name
    cubicle["description"] = CubicleData.description
    cubicle["imageUrl"] = CubicleData.imageUrl
    cubicle["difficulty"] = Number(CubicleData.difficultyLevel)
    await cubicle.save()
    return cubicle
}

async function deleteCubicle(id) {
    await Cubicle.findByIdAndDelete(id)
}

/*
const data = JSON.parse(fs.readFileSync(dataDir))

function updateDataBase() {
    return new Promise((res, rej) => {
        fs.writeFile(dataDir, JSON.stringify(data, null, 2), err => {
            if (err) rej()
            else res()
        })
    })
}

function getAllCubicles(search, from, to) {
    search = search.toLowerCase()
    return data.filter(c => c.name.toLowerCase().includes(search) || c.description.toLowerCase().includes(search))
        .filter(({ difficulty }) => difficulty >= from && difficulty <= to)
}

function getCubicleById(id) {
    return data.find(c => c.id == id)
}

async function createCubicle(CubicleData) {
    const cubicle = {
        "id": ('000000' + (Math.random() * 999999 | 0).toString(16)).slice(-6),
        "name": CubicleData.name,
        "description": CubicleData.description,
        "imageUrl": CubicleData.imageUrl,
        "difficulty": Number(CubicleData.difficultyLevel)
    }
    data.push(cubicle)
    await updateDataBase()
    return cubicle
}
*/

module.exports = {
    getAllCubicles,
    getCubicleById,
    createCubicle,
    updateCubicle,
    deleteCubicle
}