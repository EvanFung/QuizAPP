var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var middlewareObj = {};

middlewareObj.requiresAdmin = function() {
    return [
        ensureLoggedIn('./admin'),
        function(req,res,next) {
            if(req.user && req.user.isAdmin === true) {
                next();
            } else {
                res.send('no right')
            }
        }
    ]
}

middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }else {
        req.flash('error','please login first');
        res.redirect('/login');
    }

}

module.exports = middlewareObj;