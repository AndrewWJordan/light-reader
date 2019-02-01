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
        reportTotal: null,
        failTotal: null,
        status: ""
  }
  async.waterfall([
    function(callback) {
      fs.readdir(path, (err, files) => {
        if (err) return console.log(err)
        files.forEach((file, index) => {
          viewModel.reportTotal += 1
          let messages = []
          let report = require("." + path + file)
          for (i in report.audits) {
            if(report.audits[i].score == 0) {
              messages.push(report.audits[i].title)
            }
            // viewModel.reportTotal = viewModel.reports.length
          }
          if(messages.length > 0) {
            viewModel.reports[index] = {
              report: file,
              url: report.finalUrl,
              message: messages
            }
          }
        })
        callback(null)
      })
    },
    function(callback) {
      viewModel.failTotal = viewModel.reports.length
      callback(null)
    },
    function(callback) {
      res.render("results", viewModel)
    }
  ],
  function(err, results) {
    // stop everything if there is an error
    console.log(err)
  })
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
