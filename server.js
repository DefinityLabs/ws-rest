const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const wsRest = require('./index');

wsRest.use(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

var port = process.env.PORT || 9999;
var server = app.listen(port, function() {
    console.log(`ws-rest server is running on port ${port}!`);
});

module.exports = server;
