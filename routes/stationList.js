const express = require('express')
const router = express.Router()

const stationControl = require('../controllers/stationListControl')

router.route('/')
    .get(stationControl.getStationList)
    .post(stationControl.createStation)
    .patch(stationControl.updateStationInformation)
    .delete(stationControl.deleteStation)
    
module.exports = router