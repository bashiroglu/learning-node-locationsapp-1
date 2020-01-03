const express = require('express');
const parser = require('body-parser');

const placesRouters = require('./routes/placesRoutes');

const app = express();

app.use(placesRouters);

app.listen(3001);
