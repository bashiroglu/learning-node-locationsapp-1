const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const GlobalError = require('../models/GlobalError');
const getCoordinatesOfGivenAddress = require('../utils/location');
const Place = require('../models/place');
const User = require('../models/user');

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
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new GlobalError(
      'Fetching places failed, please try again later',
      500
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new GlobalError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    )
  });
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

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new GlobalError(
      'Creating place failed, please try again',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new GlobalError('Could not find user for provided id', 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new GlobalError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
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

  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    return next(
      new GlobalError('Something went wrong, could not delete place.', 500)
    );
  }

  if (!place) {
    const error = new GlobalError('Could not find place for this id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new GlobalError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted place.' });
};
exports.getPlacesbyUserId = getPlacesbyUserId;
exports.getPlacebyPlaceId = getPlacebyPlaceId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
