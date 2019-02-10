const express = require('express')
const router = express.Router()

// include report routes
router.use(require('./reports'))

// include audit routes
router.use(require('./audit'))

// general routes
router.get('/', (req, res) =>

//res.send('Welcome home.')
res.render('home', {data:'Sample Data'})
)

module.exports = router
