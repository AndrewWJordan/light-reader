const express = require('express')
const router = express.Router()
const fs = require('fs')

// the path of the folder containing the reports
const path = "./reports/"

router.get('/results', (req, res) => {
  let viewModel = {
        reports: [],
  }

  fs.readdir(path, (err, files) => {
    if (err) return console.log(err)
    files.forEach((file, index) => {
      let report = require("." + path + file)
      if(report.audits["image-alt"].score == 0) {
        viewModel.reports[index] = {
          report: file,
          message: report.audits["image-alt"].title
        }
        console.log(viewModel.reports)
      }
    })
  })
  res.render("results", viewModel)
})
module.exports = router
