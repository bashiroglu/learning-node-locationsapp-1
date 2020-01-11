const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRouter = require('./routes/placesRoutes');
const usersRouter = require('./routes/usersRoutes');
const GlobalError = require('./models/GlobalError');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/v1/places', placesRouter);
app.use('/api/v1/users', usersRouter);

app.use((req, res, next) => {
  const error = new GlobalError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// mongoose
//   .connect(
//     'mongodb+srv://bashiroghlu:bashiroghlu123@cluster0-vgrdu.mongodb.net/test?retryWrites=true&w=majority'
//     // 'mongodb+srv://bashiroghlu:bashiroghlu123@cluster0-vga0n.mongodb.net/places?retryWrites=true&w=majority'
//   )
//   .then(() => {
//     app.listen(3001);
//   })
const connectConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

mongoose
  .connect('mongodb://localhost:27017/locationapp', connectConfig)
  .then(() => {
    app.listen(3001);
  })
  .then(() => {
    console.log('successful connections with db');
  })
  .catch(error => console.log(error));
