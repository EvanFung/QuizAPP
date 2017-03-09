const express = require('express');
var router = express.Router();

//show all quizs page
router.get('/',(req,res) => {
    res.render('./quiz/quizs');
});

module.exports = router;