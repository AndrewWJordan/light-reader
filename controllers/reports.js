const express = require('express')
const router = express.Router()
const fs = require('fs')

// the path of the folder containing the reports
const path = "./reports/"

router.get('/results', (req, res) => {
  let viewModel = {
        reports: [],
        reportTotal: 0
  }

  fs.readdir(path, (err, files) => {
    if (err) return console.log(err)
    files.forEach((file, index) => {
      let messages = []
      let report = require("." + path + file)
      for (i in report.audits) {
        if(report.audits[i].score == 0) {
          messages.push(report.audits[i].title)
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
  viewModel.reportTotal += viewModel.reports.length
  res.render("results", viewModel)
})

router.get('/results/:url', (req, res) => {
  console.log(req.params.url)
  res.render("results")

})

module.exports = router
