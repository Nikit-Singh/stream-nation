const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const stripe = require('stripe')('sk_test_DpWg9Kqmne7YH0s2rW9kZ1Td');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const { ensureAuthenticated } = require('./helpers/auth');

const app = express();

// Load User Model
require('./models/User');
const User = mongoose.model('users');

const db = require('./config/database');

//Load Routes
const shop = require('./routes/shop');
const users = require('./routes/users');
const videos = require('./routes/videos');


// Passport Config
require('./config/passport')(passport);

// Static Folder For Express
app.use(express.static(path.join(__dirname, 'public')));

// Express-Session Middleware
app.use(bodyParser());

// Connect to mongoose
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('Connected with MongoDB.'))
    .catch(err => console.log(err));


// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());



// Method Override Middleware
app.use(methodOverride('_method'));


// Connect-Flash Middleware
app.use(flash());


// Global Variable
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    console.log(req.user);
    next();
});


///////////////////////////////////////////////////////////////////////////////////////////////////////


// Index Page
app.get('/', (req, res) => {
    res.render('index');
});


app.get('/dashboard', (req, res) => {

    res.render('dashboard');
});


// app.get('/services', (req, res) => {
//     res.render('services');
// });


app.get('/platform', ensureAuthenticated, (req, res) => {
    res.render('graphics/add');
})


//API Key
app.get('/services', ensureAuthenticated, (req, res) => {
    res.render('services', {
        stripePublishableKey: "pk_test_pqqsiKvR4uSvPDPTlfMc9uyE"
    });
});

//Stripe charge for payment.
//Charge route
app.post('/charge', ensureAuthenticated, (req, res) => {
    const amount = 19999;

    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer => stripe.charges.create({
            amount,
            description: "Services",
            currency: "USD",
            customer: customer.id
        }))
        .then(charge => res.redirect('/dashboard'));
});



// Use Routes
app.use('/shop', shop);
app.use('/videos', videos);
app.use('/users', users);

// Setting and Starting the Server
const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server started at localhost:${port}`);
});