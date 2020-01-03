const express = require('express');

const placesController = require('../controllers/placesController');

const router = express.Router();

router.get('/:placeId', placesController.getPlacebyPlaceId);

router.get('/user/:userId', placesController.getPlacebyUserId);
router.post('/', placesController.createPlace);

module.exports = router;
