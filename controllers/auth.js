const User = require('../models/user');


module.exports.register = (async (req, res) => {
    res.render('auth/register');
});

module.exports.registerUser = (async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Success Registered, Welcome to Yelp Camp. Signed In Successfully');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/auth/register-form');
    }
});

module.exports.login = (async (req, res) => {
    res.render('auth/login');
});

module.exports.loginUser = (async (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

module.exports.logout = ((req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logout Successfully');
        res.redirect('/auth/login-form');
    })
});