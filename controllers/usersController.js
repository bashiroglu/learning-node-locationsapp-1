const uuid = require('uuid/v4');
const GlobalError = require('../models/GlobalError');
const { validationResult } = require('express-validator');

const USERS_STATIC_ARRAY = [
  {
    id: 'u1',
    name: 'Abdulla Bahsir',
    email: 'abdulla@locationapp.com',
    password: 'test1234'
  }
];

const getUsers = (req, res, next) => {
  res.json({ users: USERS_STATIC_ARRAY });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new GlobalError(
      'Invalid inputs passed, please check your data.',
      422
    );
  } /* this f. will detect we have validation error from routes or not */
  const { name, email, password } = req.body;

  const hasUser = USERS_STATIC_ARRAY.find(u => u.email === email);
  if (hasUser) {
    throw new GlobalError(
      'Could not create user, email already exists.',
      422 /* invalid user input code*/
    );
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password
  };

  USERS_STATIC_ARRAY.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const userInDb = USERS_STATIC_ARRAY.find(u => u.email === email);
  if (!userInDb || userInDb.password !== password) {
    throw new GlobalError(
      'Could not identify user, credentials seem to be wrong.',
      401
    );
  }

  res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
