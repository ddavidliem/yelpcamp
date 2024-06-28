const Express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = Express.Router({ mergeParams: true });
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const review = require('../controllers/review');

router.post('/', isLoggedIn, validateReview, catchAsync(review.postReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));

module.exports = router;