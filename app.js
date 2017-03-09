const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
//login purpose
const passport = require('passport');
const LocalStrategy = require('passport-local');
var User = require('./models/user');
var app = express();

var indexRoutes = require('./routes/index');
var adminRoutes = require('./routes/admin');
var quizRoutes = require('./routes/quiz');
mongoose.connect("mongodb://localhost/quiz_app");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
//启动static文件名称，有了它就不用打很长的名字为routes.
app.use(express.static(__dirname + '/public'));
//启动method中间件，有了它就可以处理put,delete等等request.
app.use(methodOverride("_method"));

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
    next();
});


//启动router中间件
app.use(indexRoutes);
app.use('/admin',adminRoutes);
app.use('/quiz',quizRoutes);
app.listen(process.env.PORT,process.env.IP,function() {
    console.log('Quiz app server has started!');
});