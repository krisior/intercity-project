const mongoose = require('mongoose')

const stationSchema = new mongoose.Schema({
    
    type: String,
    s_id: String,
    name: String,
    upper: String,
    weight: {
        type: Number,
        deafult: 0
    },
    slug: String
})

module.exports = mongoose.model('station', stationSchema)