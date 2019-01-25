const express = require('express')
const app = express()
const fs = require('fs')
const url = require('url')
const dateFormat = require('dateformat')
const port = 3000

// include json report
const path = "./reports/"
//const report = require("./reports/20190114www_marist_edu_about_presidents_office_speeches_writings_inaugural_address.json")

var reader = function (req, res, next) {
  fs.readdir("./reports", (err, files) => {
  files.forEach(file => {
    let report = require(path + file)
    if(report.audits["image-alt"].score == 0) {
      console.log(file)
      console.log(report.audits["image-alt"].title)
    }
  });
})
  next()
}

app.use(reader)

// include routes
app.use(require('./controllers'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
