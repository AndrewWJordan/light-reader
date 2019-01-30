const express = require('express')
const app = express()
const hbs  = require('express-handlebars');
const url = require('url')
const dateFormat = require('dateformat')
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
    }
  }
}));

app.set('view engine', 'handlebars');

app.listen(port, () => console.log(`LightReader is listening on port ${port}!`))
