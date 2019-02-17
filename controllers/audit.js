const express = require('express')
const router = express.Router()
const fs = require('fs')
const async = require("async")
const lighthouse = require("../tools/lighthouse-auditor")
const emoji = require('node-emoji')
const bodyParser = require('body-parser')
// use spawn to stream larger data sets
const { spawn } = require('child_process');
const xmlParser = require('xml2js');

// the path of the folder containing the reports
const path = "./reports/"

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

let filename = "./sitemap.xml"

router.get('/audit', (req, res) => {
  res.render("audit")
})

router.post('/audit', urlencodedParser, (req, res) => {
  let viewModel = {
        reports: [],
        reportTotal: null,
        failTotal: null,
        status: "",
        auditUrl: "",
        auditType: ""
  }
  if (req.body) {
      viewModel.auditUrl = req.body.auditUrl
      viewModel.auditType = req.body.radio
      if (viewModel.auditType == 'site') {
        async.waterfall([
          function(callback) {
            // Get the sitemap.xml file
            const child = spawn('curl -L -o sitemap.xml "' + viewModel.auditUrl + '"', {
              stdio: 'inherit',
              shell: true
            });
            child.on('exit', code => {
              console.log("Sitemap retrieved.  Create a CSV...")
              callback(null);
            });
          },
          function(callback) {
          // xml to json
            var parser = new xmlParser.Parser();
            fs.readFile(filename, function(err, data) {
              parser.parseString(data, function (err, result) {
                for (let url of result.urlset.url) {
                  lighthouse.urls.push(url.loc)
                }
                console.log(lighthouse.urls)
                console.log('Parsing completed.')
              });
            });
          }
        ],
        function(err, results) {
          // stop everything if there is an error
          console.log(err);
        });
      }
  }

  res.render("audit", viewModel)

})
module.exports = router
