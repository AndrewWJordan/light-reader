const express = require('express')
const router = express.Router()
const fs = require('fs')
const async = require("async")
const lighthouse = require("../tools/lighthouse-auditor")
const emoji = require('node-emoji')

// the path of the folder containing the reports
const path = "./reports/"

router.get('/audit', (req, res) => {
  let viewModel = {
        reports: [],
        reportTotal: null,
        failTotal: null,
        status: "",
        pageScores: []
  }

  res.render("audit", viewModel)

})
module.exports = router
