const express = require('express');

const placesController = require('../controllers/placesController');

const router = express.Router();

router.get('/:placeId', placesController.getPlacebyPlaceId);

router.get('/user/:userId', placesController.getPlacesbyUserId);
router.post('/', placesController.createPlace);
router.patch('/:placeId', placesController.updatePlace);
router.delete('/:placeId', placesController.deletePlace);

module.exports = router;
