const Express = require('express');
const catchAsync = require('../utils/catchAsync');
const campground = require('../controllers/campground');
const router = Express.Router({ mergeParams: true });
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



router.get('/', catchAsync(campground.index));

router.get('/form', isLoggedIn, campground.newForm);

router.post('/new', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.newCampground));

router.get('/:id', catchAsync(campground.viewCampround));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.editCampground));

router.put('/:id/update', isLoggedIn, isAuthor, validateCampground, catchAsync(campground.updateCampground));

router.delete('/:id/delete', isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));




module.exports = router;