const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('get req');
  res.json({ status: 'success' });
});

module.exports = router;
