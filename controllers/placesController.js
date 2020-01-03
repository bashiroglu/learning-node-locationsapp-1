const uuid = require('uuid/v4');

const GlobalError = require('../models/GlobalError');

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

const getPlacebyPlaceId = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = PLACES_STATIC_ARRAY.find(p => p.id === placeId);
  if (!place) {
    throw new GlobalError('Could not find a place for the provided id.', 404);
  }
  res.json({ place });
};

const getPlacebyUserId = (req, res, next) => {
  const userId = req.params.userId;
  const place = PLACES_STATIC_ARRAY.find(p => p.creator === userId);

  if (!place) {
    return next(
      new GlobalError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json({ place });
};
const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid() /* third party function to create id */,
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  PLACES_STATIC_ARRAY.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

exports.getPlacebyUserId = getPlacebyUserId;
exports.getPlacebyPlaceId = getPlacebyPlaceId;
exports.createPlace = createPlace;
