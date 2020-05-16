'use strict';

var port = process.env.PORT || 8080;
var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.resolve(__dirname, "dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(port);