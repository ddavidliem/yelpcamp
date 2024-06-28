if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const fetchRandomPhoto = require('./unsplash/index');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const authroute = require('./routes/auth');
const campgroundroute = require('./routes/campground');
const reviewroute = require('./routes/reviews');
const dbURL = 'mongodb://127.0.0.1:27017/yelpcamp';


mongoose.connect(dbURL, {
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Connection Error:', err);
    });

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

app.use(mongoSanitize({
    replaceWith: '-'
}));

const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret : 'thisshouldbeasecret!'
    }
});


store.on("error", function(e){
    console.log("SESSION STORE ERROR",e)
});

const sessionConfig = {
    store,
    secret: 'testpassword',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dsbtugvtv/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/testUser', async (req, res) => {
    const user = new User({ email: 'testuser@gmai.com', username: 'testuser' });
    const newUser = await User.register(user, 'qwerty123');
    res.send(newUser);
});

app.use('/auth', authroute);
app.use('/campgrounds', campgroundroute);
app.use('/campgrounds/:id/reviews', reviewroute);

app.get('/', async (req, res) => {
    try{
        const image = await fetchRandomPhoto();
        res.render('home',{image});
    }catch(error){
        console.error('Error fetching image from unsplash',error);
        res.status(500).send('Failed to fetch image');
    }
});

app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Server is Up on port 3000, Go do it');
})
