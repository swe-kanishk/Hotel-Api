const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewsController');
const isLoggedIn = require('../middlewares/authMiddleware');


router.post('/', isLoggedIn, reviewController.createReview);


router.get('/listing/:listingId', reviewController.getReviewsByListingId);


router.put('/:id', isLoggedIn, reviewController.updateReview);


router.delete('/:id', isLoggedIn, reviewController.deleteReview);

module.exports = router;
