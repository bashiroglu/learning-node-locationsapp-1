const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const GlobalError = require('../models/GlobalError');
const getCoordinatesOfGivenAddress = require('../utils/location');
const Place = require('../models/place');

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

const getPlacebyPlaceId = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new GlobalError('Something went wrong, could not find a place.', 500)
    );
  }

  if (!place) {
    const error = new GlobalError(
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }

  res.json({
    place: place.toObject({ getters: true })
  }); /*  in here we say that we
   want place as a object and by saying getters true, we say brind id in 
   name of id without _ */
};

const getPlacesbyUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new GlobalError(
      'Fetching places failed, please try again later',
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new GlobalError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({
    places: places.map(place => place.toObject({ getters: true }))
  }); /* because 
  this map we loop and convert or impliment the same code each element of array */
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new GlobalError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordinatesOfGivenAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator
  });

  try {
    await createdPlace.save();
  } catch (err) {
    return next(
      new GlobalError('Creating place failed, please try again.', 500)
    );
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new GlobalError(
      'Invalid inputs passed, please check your data.',
      422
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.placeId;

  let placeToUpdate;
  try {
    placeToUpdate = await Place.findById(placeId);
  } catch (err) {
    return next(
      new GlobalError('Something went wrong, could not update place.', 500)
    );
  }

  placeToUpdate.title = title;
  placeToUpdate.description = description;

  try {
    await placeToUpdate.save();
  } catch (err) {
    return next(
      new GlobalError('Something went wrong, could not update place.', 500)
    );
  }

  res.status(200).json({ place: placeToUpdate.toObject({ getters: true }) });
};
const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;
  ``;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new GlobalError('Something went wrong, could not delete place.', 500)
    );
  }

  try {
    await place.remove();
  } catch (err) {
    return next(
      new GlobalError('Something went wrong, could not delete place.', 500)
    );
  }

  res.status(200).json({ message: 'Deleted place.' });
};
exports.getPlacesbyUserId = getPlacesbyUserId;
exports.getPlacebyPlaceId = getPlacebyPlaceId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
