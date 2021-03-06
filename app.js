var express             = require('express'),
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    passport            = require('passport'),
    flash               = require('connect-flash'),
    LocalStrategy       = require('passport-local'),
    methodOverride      = require('method-override'),
    seedDB              = require('./seeds'),
    Campground          = require('./models/campground'),
    User                = require ('./models/user'),
    Comment             = require('./models/comment');

var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    indexRoutes         = require('./routes/index');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb+srv://peachesbonbon:B1u9c9K7yb4rN35P4h45@cluster0-gdinf.mongodb.net/yelp_camp');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());


/* seedDB(); */

/* PASSPORT CONFIGURATION */
app.use(require('express-session')({
    secret: 'Bucky is the best dog ever!',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

/* app.listen(3000, function() {
    console.log('App running on port 3000.');
}); */

app.listen(process.env.PORT || 5000);