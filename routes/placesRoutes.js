const express = require('express');
const { check } = require('express-validator');
const fileUpload = require('../middleware/file-upload');
const placesController = require('../controllers/placesController');

const router = express.Router();

router.get('/:placeId', placesController.getPlacebyPlaceId);

router.get('/user/:userId', placesController.getPlacesbyUserId);
router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],
  placesController.createPlace
);
router.patch(
  '/:placeId',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  placesController.updatePlace
);
router.delete('/:placeId', placesController.deletePlace);

module.exports = router;
