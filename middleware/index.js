var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var middlewareObj = {};

middlewareObj.requiresAdmin = function() {
    return [
        ensureLoggedIn('./admin'),
        function(req,res,next) {
            if(req.user && req.user.isAdmin === true) {
                next();
            } else {
                res.send('Unauthorized');
            }
        }
    ]
}

module.exports = middlewareObj;