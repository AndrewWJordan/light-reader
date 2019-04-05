const express = require('express')
const router = express.Router()
const fs = require('fs')
const async = require("async")
const lighthouse = require("../tools/lighthouse-auditor")
const csv = require("fast-csv")
const emoji = require('node-emoji')

// the path of the folder containing the reports
const path = "./reports/"

router.get('/results', (req, res) => {
  let viewModel = {
        reports: [],
        reportTotal: null,
        failTotal: null,
        status: "",
        pageScores: [],
        summaryCSV: [],
  }
  async.waterfall([
    function(callback) {
      // create the reports directory if it doesn't exist
      if (!fs.existsSync(path)){
          fs.mkdirSync(path);
      }
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
                //push all report results to summaryCSV
                viewModel.summaryCSV.push({
                  url: report.finalUrl,
                  score: report.categories.accessibility.score,
                })
              // extract failed audits for each page
              for (i in report.audits) {
                try {
                  // if(typeof report.audits[i].score === "object") {
                  //   console.log(file)
                  //   console.log(report.audits[i].title)
                  // }
                  if(report.audits[i].score === 0) {
                    if(report.audits[i].title != undefined) {
                      messages.push(report.audits[i].title)
                      details = []
                      for (el in report.audits[i].details.items) {
                        details.push(report.audits[i].details.items[el].node.snippet)
                      }
                    } else {
                      console.log("Title is undefined: " + report)
                    }
                  }
                } catch(err) {
                  console.log("Error when extracting report errors: " + err.message)
                }
              }
              try {
                if(messages.length > 0) {
                  viewModel.reports.push({
                    report: file,
                    url: report.finalUrl,
                    message: messages,
                    detail: details,
                    score: report.categories.accessibility.score
                  })
                }
              } catch(err) {
                console.log("Error when saving report details to reports object: " + err.message)
              }
            }
          })
        callback(null)
      })
    },
    function(callback) {
      viewModel.failTotal = viewModel.reports.length
      console.log(viewModel.failTotal)
      callback(null)
    },
    function(callback) {

      // generate CSV file in reports folder from reports object
      var csvStream = csv.format({headers: true}),
      writableStream = fs.createWriteStream("light-reader-results.csv");

      writableStream.on("finish", function(){
        console.log( emoji.emojify(":sun_with_face:") + " " + emoji.emojify(":doughnut:") + " CSV created for your convenience.")
        callback(null)
      });

      csvStream.pipe(writableStream);

      viewModel.reports.forEach(function(report, index) {
         if(report.url) {
          csvStream.write({url: report.url, messages: report.message, details: report.detail, score: report.score})
         } else {
          console.log("There was an issue locating the report URL while generating the CSV.")
         }
      })

      csvStream.end();

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
