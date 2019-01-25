const express = require('express')
const router = express.Router()

router.get('/results', (req, res) => res.send("Report results here."))

module.exports = router
