const express = require('express')
const app = express()
const router = express.Router()
const fs = require('fs')
const async = require("async")
const lighthouse = require("../tools/lighthouse-auditor")
const emoji = require('node-emoji')
const bodyParser = require('body-parser')


// the path of the folder containing the reports
const path = "./reports/"

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/audit', urlencodedParser, (req, res) => {
  let viewModel = {
        reports: [],
        reportTotal: null,
        failTotal: null,
        status: "",
        pageScores: [],
        auditUrl: "",
        auditType: ""
  }
  if (!req.body) return res.sendStatus(400)
  viewModel.auditUrl = req.body.auditUrl
  viewModel.auditType = req.body.radio
  res.render("audit", viewModel)

})
module.exports = router
