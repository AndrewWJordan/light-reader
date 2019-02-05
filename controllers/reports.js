const express = require('express')
const router = express.Router()
const fs = require('fs')
const async = require("async")
const lighthouse = require("../tools/lighthouse-auditor")
const emoji = require('node-emoji')

// the path of the folder containing the reports
const path = "./reports/"

router.get('/results', (req, res) => {
  let viewModel = {
        reports: [],
        reportTotal: null,
        failTotal: null,
        status: "",
        pageScores: []
  }
  async.waterfall([
    function(callback) {
      fs.readdir(path, (err, files) => {
        if (err) return console.log(err)
          files.forEach((file, index) => {
            // only json files please
            if(file.substring(file.indexOf('.')+1) == "json") {
              viewModel.reportTotal += 1
              let messages = []
              let report = require("." + path + file)
              // get each page's score to calculate overall score
              viewModel.pageScores.push(report.categories.accessibility.score)
              // extract failed audits for each page
              for (i in report.audits) {
                if(report.audits[i].score == 0) {
                  messages.push(report.audits[i].title)
                  details = []
                  for (el in report.audits[i].details.items) {
                    details.push(report.audits[i].details.items[el].node.snippet)
                  }
                }
              }
              if(messages.length > 0) {
                viewModel.reports[index] = {
                  report: file,
                  url: report.finalUrl,
                  message: messages,
                  detail: details,
                  score: report.categories.accessibility.score
                }
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
    console.log(emoji.emojify(":skull: " + err))
  })
})

router.get('/results/:url', (req, res) => {
  async.waterfall([
    function(callback) {
      lighthouse.urls.push(req.params.url)
      lighthouse.launchAudit(lighthouse.urls).then(result => {
        console.log(emoji.emojify(":beers: done"))
        callback(null)
      })
    },
    function(callback) {
      res.redirect("/results")
    }
  ],
  function(err, results) {
    // stop everything if there is an error
    console.log(emoji.emojify(":skull: " + err))
  })

})

module.exports = router
