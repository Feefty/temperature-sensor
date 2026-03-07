const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./adapters/http/swagger');
const temperatureRoutes = require('./adapters/http/routes/temperature.routes');

const app = express();
app.use(express.json());
app.use('/api', temperatureRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => res.redirect('/api-docs'));

module.exports = app;