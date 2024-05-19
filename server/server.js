var express = require('express');
var app = express();

app.get('/api/hello', function (req, res) {
    res.send("hello world!");
});

app.listen(5000);
