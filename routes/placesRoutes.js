const express = require('express');

const GlobalError = require('../models/GlobalError');

const router = express.Router();

const PLACES_STATIC_ARRAY = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];

router.get('/:placeId', (req, res, next) => {
  const placeId = req.params.placeId;
  const place = PLACES_STATIC_ARRAY.find(p => p.id === placeId);
  if (!place) {
    throw new GlobalError('Could not find a place for the provided id.', 404);
  }
  res.json({ place });
});

router.get('/user/:userId', (req, res, next) => {
  const userId = req.params.userId;
  const place = PLACES_STATIC_ARRAY.find(p => p.creator === userId);

  if (!place) {
    return next(
      new GlobalError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json({ place });
});

module.exports = router;
