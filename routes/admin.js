const express = require('express');
var router = express.Router();
const middlewareObj = require('../middleware/index');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.all('/*',middlewareObj.requiresAdmin());
//index route
router.get('/',(req,res) => {
    res.render('./admin/index');
});
module.exports = router;