const express = require('express');

const placesController = require('../controllers/placesController');

const router = express.Router();

router.get('/:placeId', placesController.getPlacebyPlaceId);

router.get('/user/:userId', placesController.getPlacebyUserId);

module.exports = router;
