const Station = require('../models/Station')
const path = require('path')

const asyncHandler = require('express-async-handler')

// @desc get list of all stations
// @route GET /stations
// @access private
const getStationList = asyncHandler(async (req, res) => {
    const stations = await Station.find().select('-_id s_id name').lean()
    if (!stations?.length) {
        return res.status(400).json({ message: 'No stations found' })
    }

    // res.sendFile(path.join(__dirname, '..', 'api_views', 'stations.html'))
    res.send(JSON.stringify(stations))
})

// @desc create station
// @route POST /stations
// @access private
const createStation = asyncHandler(async (req, res) => {
    const { s_id, name } = req.body

    if (!s_id || !name) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    
    const duplicate = await Station.findOne({ s_id }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate station'})
    }

    // creating additional names
    const slugName  = String(name).normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\u0142/g, "l").replace(/\s/g, '').toLowerCase()
    const upperName = String(name).normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\u0142/g, "l").toUpperCase()

    const stationObject = { 
        "type": "station", 
        "s_id": s_id,
        name,
        "upper": upperName,
        "weight": 0,
        "slug": slugName
    }

    // create and store station
    const station = await Station.create(stationObject)

    if (station) {
        res.status(201).json({ message: `New station ${s_id} ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid station data received' })
    }
})

// @desc update station information
// @route PATCH /stations
// @access private
const updateStationInformation = asyncHandler(async (req, res) => {
    const { s_id, name } = req.body
 
    if (!s_id) {
        return res.status(400).json({ message: 'Station ID field is required' })
    }

    const station = await Station.findOne({ s_id }).exec()

    if (!station) {
        return res.status(400).json({ message: 'Station not found' })
    }

    // creating additional names
    const upperName = String(name).normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\u0142/g, "l").toUpperCase()
    const slugName  = String(name).normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\u0142/g, "l").replace(/\s/g, '').toLowerCase()

    station.s_id = s_id
    station.name = name
    station.upper = upperName
    station.slug = slugName

    const updatedStation = await station.save()

    res.json({ message: `Station ${updatedStation.s_id} ${updatedStation.name} updated` })
})

// @desc delete station
// @route DELETE /stations
// @access private
const deleteStation = asyncHandler(async (req, res) => {
    const { s_id } = req.body

    if (!s_id) {
        return res.status(400).json({ message: 'Station ID required' })
    }

    const station = await Station.findOne({ s_id }).exec()

    if (!station) {
        return res.status(400).json({ message: 'Station not found' })
    }

    const result = await station.deleteOne()

    res.json({ message: `Station ${result.s_id} ${result.name} deleted` })
})

module.exports = {
    getStationList,
    createStation,
    updateStationInformation,
    deleteStation
}