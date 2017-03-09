const express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
//index route
router.get('/',(req,res) => {
    res.render('index');
});

//login route
//show login page
router.get('/login',(req,res) => {
    res.render('login');
});

router.post('/login',passport.authenticate('local',{
    successRedirect:"/",
    failureRedirect:"/login"
}),function(req,res) {});

//logout route
router.get('/logout',(req,res) => {
    req.logout();
    res.redirect('/');
});

//register route
//show register page
router.get('/register',(req,res) => {
   res.render('register'); 
});
//handle sign up logic
router.post('/register',(req,res) => {
    var newUser = new User({
        username:req.body.username
    });
    User.register(newUser,req.body.password,function(err,user) {
        if(err) {
            res.redirect('register');    
        } else {
            passport.authenticate('local')(req,res,function() {
                res.redirect('/');
            })
        }
    });
});
module.exports = router;