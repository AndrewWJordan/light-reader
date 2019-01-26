const express = require('express')
const app = express()
const hbs  = require('express-handlebars');
const url = require('url')
const dateFormat = require('dateformat')
const port = 3000

// include routes
app.use(require('./controllers'))

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(port, () => console.log(`Light Reader is listening on port ${port}!`))
