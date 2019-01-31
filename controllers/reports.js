const express = require('express')
const router = express.Router()
const fs = require('fs')
const async = require("async")
const lighthouse = require("../tools/lighthouse-auditor")

// the path of the folder containing the reports
const path = "./reports/"

router.get('/results', (req, res) => {
  let viewModel = {
        reports: [],
        reportTotal: 0,
        status: ""
  }
  if(req.status) {
    viewModel.status = req.status
  }
  fs.readdir(path, (err, files) => {
    if (err) return console.log(err)
    files.forEach((file, index) => {
      let messages = []
      let report = require("." + path + file)
      for (i in report.audits) {
        if(report.audits[i].score == 0) {
          messages.push(report.audits[i].title)
          viewModel.reportTotal += 1
        }
      }
      if(messages.length > 0) {
        viewModel.reports[index] = {
          report: file,
          url: report.finalUrl,
          message: messages
        }
      }
    })
  })
  res.render("results", viewModel)
})

router.get('/results/:url', (req, res) => {
  async.waterfall([
    function(callback) {
      lighthouse.urls.push(req.params.url)
      lighthouse.launchAudit(lighthouse.urls).then(result => {
        console.log("done")
        callback(null)
      })
    },
    function(callback) {
      res.redirect("/results")
    }
  ],
  function(err, results) {
    // stop everything if there is an error
    console.log(err)
  })

})

module.exports = router
