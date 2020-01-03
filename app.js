const express = require('express');
const bodyParser = require('body-parser');

const placesRouter = require('./routes/placesRoutes');
const usersRouter = require('./routes/usersRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/api/v1/places', placesRouter);
app.use('/api/v1/users', usersRouter);


app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
}); /* we add this middleware and by adding this, we say
when we have error as a first param take this as a special function and 
if we  have header sent call error */

app.listen(3001);
