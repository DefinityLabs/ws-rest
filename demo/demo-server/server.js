const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', '*');
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.get('/echo/:number', function(req, res){
  setTimeout(function() {
    res.send(`${req.params.number}`);
  }, 300);
});

var port = process.env.PORT || 8080;
var server = app.listen(port, function() {
    console.log(`demo server is running on port ${port}!`);
});

module.exports = server;
