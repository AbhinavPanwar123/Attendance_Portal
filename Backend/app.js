var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');

var authController = require('./Controller/authContoller')


var app = express();
const cors = require('cors');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api',authController)
app.use('/uploads', express.static(path.join(__dirname,'uploads'))); 

module.exports = app;
