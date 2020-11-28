require('dotenv').config();

const express = require('express');

const app = express();
const MyCuisinessRoutes = require('./api/routes/MyCuisinessRoutes');

const myCuisinessRoutes = new MyCuisinessRoutes();

app.use('/', myCuisinessRoutes.getRoutes());

module.exports = app;
