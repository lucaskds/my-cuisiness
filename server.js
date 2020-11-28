require('dotenv').config()

const express = require("express");
const app = express();
const MyCuisinessRoutes = require('./api/routes/MyCuisinessRoutes');

const myCuisinessRoutes = new MyCuisinessRoutes();
const port = process.env.PORT || 3000;

app.use('/', myCuisinessRoutes.getRoutes());

app.listen(port);

console.log("My Cuisiness is running");
