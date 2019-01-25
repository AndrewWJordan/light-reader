const express = require('express')
const router = express.Router()

// include report routes
router.use(require('./reports'))

// general routes
router.get('/', (req, res) => res.send('Welcome home.'))

module.exports = router
