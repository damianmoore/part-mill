var express = require('express')
var app = express()
var gitRevision = require('git-revision')

app.set('views', '.')
app.set('view engine', 'ejs')

app.use('/js', express.static('js'))
app.use('/img', express.static('img'))

app.get('/', function (req, res) {
  res.render('index', { version: gitRevision('short') })
});

app.listen(3000, function () {
  console.log('Server listening on port 3000')
})
