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
      console.log(arr)
      let total = null
      for(let num of arr) {
        console.log(parseFloat(num))
        total += parseFloat(num)
      }
      console.log(total)
      return total / arr.length * 100
    }
  }
}))

app.set('view engine', 'handlebars')

app.listen(port, () => console.log(emoji.emojify(`:books: LightReader is listening on port ${port}!`)))
