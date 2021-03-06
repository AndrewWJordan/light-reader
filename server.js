"use strict"

const express = require('express')
const app = express()
const hbs  = require('express-handlebars')
const emoji = require('node-emoji')
const port = 3000

// include routes
app.use(require('./controllers'))

// set templating engine w/ helpers
app.engine('handlebars', hbs({
  defaultLayout: 'main',
  helpers: {
    encode: function(url) {
      url = encodeURIComponent(url)
      return url
    },
    convert: function(score) {
      score = score * 100
      return score
    },
    average: function(arr) {
      let total = null
      for(let num of arr) {
        total += parseFloat(num)
      }
      return ((total / arr.length) * 100).toFixed(0)
    }
  }
}))

app.set('view engine', 'handlebars')

module.exports = app.listen(port, () => console.log(emoji.emojify(`:books:  LightReader is listening on port ${port}!`)))
