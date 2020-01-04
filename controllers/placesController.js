const uuid = require('uuid/v4');

const GlobalError = require('../models/GlobalError');

let PLACES_STATIC_ARRAY = [
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

const getPlacesbyUserId = (req, res, next) => {
  const userId = req.params.userId;
  const places = PLACES_STATIC_ARRAY.filter(p => p.creator === userId);

  if (!places || places.length === 0) {
    return next(
      new GlobalError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json({ places });
};
const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  PLACES_STATIC_ARRAY.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.placeId;

  const placeToUpdate = { ...PLACES_STATIC_ARRAY.find(p => p.id === placeId) };
  const IndexOfPlaceToUpdate = PLACES_STATIC_ARRAY.findIndex(
    p => p.id === placeId
  );
  if (title) placeToUpdate.title = title;
  if (description) placeToUpdate.description = description;
  PLACES_STATIC_ARRAY[IndexOfPlaceToUpdate] = placeToUpdate;

  res.status(201).json({ place: placeToUpdate });
};
const deletePlace = (req, res, next) => {
  const placeId = req.params.placeId;

  PLACES_STATIC_ARRAY = PLACES_STATIC_ARRAY.filter(p => p.id !== placeId);

  res.status(204).json({ message: 'deleted' });
};
exports.getPlacesbyUserId = getPlacesbyUserId;
exports.getPlacebyPlaceId = getPlacebyPlaceId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;