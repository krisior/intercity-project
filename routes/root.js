const express = require('express')
const router = express.Router()
const path = require('path')

// ^ -> beginning only --- & -> end only --- ? -> optional

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'api_views', 'index.html'))
})

module.exports = router