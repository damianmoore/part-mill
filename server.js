var express = require('express')
var app = express()

app.set('views', '.')
app.set('view engine', 'ejs')

app.use('/js', express.static('js'))

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'})
});

app.listen(3000, function () {
  console.log('Server listening on port 3000')
})
