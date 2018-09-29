const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const { ensureAuthenticated } = require('./helpers/auth');


const app = express();



// Load User Model
require('./models/User');


// Passport Config
require('./config/passport')(passport);


//Load Routes
const shop = require('./routes/shop');
const users = require('./routes/users');
const videos = require('./routes/videos');
// const auth = require('./routes/auth');
// const keys = require('./config/keys');


// Express-Session Middleware
app.use(bodyParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Connect to mongoose
mongoose.connect('mongodb://localhost/stream-nation', { useNewUrlParser: true })
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


// Static Folder For Express
app.use(express.static(path.join(__dirname, 'public')));


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
    next();
});


///////////////////////////////////////////////////////////////////////////////////////////////////////


// Index Page
// app.get('/', (req, res) => {
//     res.render('index');
// });

// app.get('/', (req, res) => {
//     res.render('index2');
// });


// FAQ Page
app.get('/faq', (req, res) => {
    res.render('faq');
});


app.get('/dashboard', (req, res) => {
    res.render('dashboard')
});


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// Use Routes
app.use('/shop', shop);
app.use('/videos', videos);
// app.use('/auth', auth);
app.use('/users', users);

//API Key

app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: "pk_test_pqqsiKvR4uSvPDPTlfMc9uyE"
    });
});

//Stripe charge for payment.
//Charge route
// app.post('/charge', (req, res) => {
//     const amount = 2500;

//     stripe.customers.create({
//         email: req.body.stripeEmail,
//         source: req.body.stripeToken
//     })
//     .then(customer => stripe.charges.create({
//         amount,
//         description: "Services",
//         currency: "USD",
//         customer: customer.id
//     }))
//     .then(charge => res.render('success'));
// });
app.post('/charge', (req, res) => {
        const amount = 2500;
        console.log(req.body);
        res.send('Test')
    })
    // });
    // Setting and Starting the Server
const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server started at localhost:${port}`);
});