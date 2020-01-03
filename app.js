const express = require('express');
const parser = require('body-parser');

const placesRouter = require('./routes/placesRoutes');
const usersRouter = require('./routes/usersRoutes');

const app = express();

app.use('/api/v1/places', placesRouter);
app.use('/api/v1/users', usersRouter);

app.listen(3001);
