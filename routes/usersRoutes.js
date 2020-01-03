const express = require('express');

const router = express.Router();

const USERS_STATIC_ARRAY = [
  {
    id: 'u1',
    name: 'Hasan',
    surname: 'AgaMirza'
  }
];

router.get('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  const user = USERS_STATIC_ARRAY.find(user => user.id === userId);
  res.json({ user });
});

module.exports = router;
