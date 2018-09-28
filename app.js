const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();


//Load Routes
const shop = require('./routes/shop');
const users = require('./routes/users');


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


// Express-Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


// Connect-Flash Middleware
app.use(flash());


// Global Variable
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


///////////////////////////////////////////////////////////////////////////////////////////////////////


// Index Page
app.get('/', (req, res) => {
    res.render('index');
});


// FAQ Page
app.get('/faq', (req, res) => {
    res.render('faq');
});


// Use Routes
app.use('/shop', shop);
// app.use('/users', users);


// Setting and Starting the Server
const port = process.env.PORT | 3000;

app.listen(port, () => {
    console.log(`Server started at localhost:${port}`);
});