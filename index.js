const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware=require('./config/middleware');

app.use(express.urlencoded());
app.use(express.static('./assets'));
app.use(expressLayouts);

app.set('layout', './layout');
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine ejs
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session( {
    name: 'restomanagement',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
        mongoUrl: 'mongodb://localhost/Resto_Management_db',
        autoRemove: 'disabled'
        },
        function(err) {
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'))
app.use(flash());
app.listen(port, (err)=>{
    if(err) {
        console.log('error: ',err);
    }
    console.log(`express is running on port: ${port}`);
});