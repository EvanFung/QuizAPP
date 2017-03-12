const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
//login purpose
const passport = require('passport');
const LocalStrategy = require('passport-local');
var User = require('./models/user');
var app = express();
var flash = require('connect-flash');
var indexRoutes = require('./routes/index');
var adminRoutes = require('./routes/admin');
var quizRoutes = require('./routes/quiz');
var playRoutes = require('./routes/play');
mongoose.connect("mongodb://localhost/quiz_app");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret:"Quiz App!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//PASSPORT CONFIGURATION


//set golbal object
app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


app.use(indexRoutes);
app.use('/admin',adminRoutes);
app.use('/quiz',quizRoutes);
app.use('/play',playRoutes);
app.listen(process.env.PORT,process.env.IP,function() {
    console.log('Quiz app server has started!');
});