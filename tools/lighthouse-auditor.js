const fs = require('fs')
const async = require("async")
// use spawn to stream larger data sets
const { spawn } = require('child_process')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const url = require('url')
const dateFormat = require('dateformat')
const emoji = require('node-emoji')

module.exports = {
   urls: [],
   opts: {
     onlyCategories: ['accessibility'],
     chromeFlags: ['--headless']
   },
   now: new Date(),
   oldFile: "",

   // Launch Lighthouse and Chrome
  launchChromeAndRunLighthouse: function (url, opts, config = null) {
    return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
      opts.port = chrome.port
      return lighthouse(url, opts, config).then(results => {
        return chrome.kill().then(() => results.report)
      })
    })
  },

  // Lighthouse is returning a Promise
  // So we have to use async and await to run reports
  // one at a time
  launchAudit: async function (urls) {
    for (let URL of urls) {
      await this.launchChromeAndRunLighthouse(URL, this.opts).then(results => {

        //folder = dateFormat(now, 'yyyymmdd') + '-' + url.parse(URL).hostname
        // create the reports folder if it doesn't already exist
        if(!fs.existsSync("reports/")) {
          fs.mkdirSync("reports/")
        }
        // construct the full file name of the new report
        filename = url.parse(URL).hostname + url.parse(URL).pathname
        filename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        console.log(filename + '.json')
        // check to see if a report exists already. If so rm it.
        if(fs.readdirSync('reports/').filter(fn => fn.includes(filename + '.json'))) {
            fs.unlink('reports/' + filename + '.json', (err) => {
              if (err) {
                console.log(emoji.emojify(":skull: " + err))
              }
              // if no error, file has been deleted successfully
              console.log(emoji.emojify(':wastebasket: File deleted!'))
            })
        }
        // append date to filename
        //filename = dateFormat(this.now, 'yyyymmdd') + filename
        fs.writeFile('reports/' + filename + '.json', results, function(err, result) {
          if(err) {
            console.log('error', err)
          }
          return result
        })
      })
    }
  }
}
