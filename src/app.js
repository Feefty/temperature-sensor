const express = require('express');
const temperatureRoutes = require('./adapters/http/routes/temperature.routes');

const app = express();
app.use(express.json());
app.use('/api', temperatureRoutes);

module.exports = app;