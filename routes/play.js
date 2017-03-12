const express = require('express');
var router = express.Router();
var Quiz = require('../models/quizzes');
var Question = require('../models/questions');
var Answer = require('../models/answers');
var middleObject = require('../middleware/');
var quizSubmissions = require('../models/quizSubmissions');
router.get('/',middleObject.isLoggedIn,(req,res) => {
    Quiz.find({},function(err,quizzes) {
        if(err) {
            console.log(err);
        } else {
            res.render('./play/',{quizzes:quizzes});
        }
    });
});

router.get('/quiz/:id',middleObject.isLoggedIn,(req,res) => {
    Quiz.findById(req.params.id,function(err,quiz) {
        if(err) {
            console.log(err);
        } else {
            res.render('./play/quiz',{quiz:quiz});
        }
    });
});

router.post('/quiz/:id/process',middleObject.isLoggedIn, (req,res) => {
    var starter = req.body.starter;
    var quizid = req.params.id;
    var selectedAnswer = [];
    Quiz.findById(quizid)
    .populate({path:'questions',model:'Questions',populate:{path:'answers',model:'Answers'}})
    .exec(function(err,foundQuiz) {
        if(err) {
            console.log(err);
        } else {
            if(typeof starter !== 'undefined') {
                req.session.score = 0;
                req.session.num = 0;
                req.session.starttime = new Date();
                req.session.answer = [];
                res.render('./play/test',{
                    num:req.session.num,
                    quiz:foundQuiz,
                    score:req.session.score
                });
            } else {
                var num = parseInt(req.body.num);
                var answer = req.body.answers;
                var quizid = req.body.quizid;
                
                //push the answer to array
                req.session.answer.push(answer);
                
                req.session.num = num + 1;
                //if user answer were corrected, score +1
                if(foundQuiz.questions[num].answers.correct === answer) {
                    req.session.score = req.session.score + 1;
                }
                //if current question index > question length, jump to the result page.
                if(req.session.num < foundQuiz.questions.length) {
                    console.log(req.session.score);
                    res.render('./play/test',{
                        num:req.session.num,
                        quiz:foundQuiz,
                        score:req.session.score
                    });
                } else {
                    new quizSubmissions({
                        user:res.locals.currentUser._id,
                        quiz:quizid,
                        selected:req.session.answer,
                        score:req.session.score
                    }).save();
                    res.redirect('/play/quiz/'+quizid+'/result');
                }
            }
        }
    }); 
});

router.get('/quiz/:id/test',middleObject.isLoggedIn,(req,res) => {
    var quizid = req.params.id;
    var score = req.session.score;
    Quiz.findById(quizid)
    .populate({path:'questions',model:'Questions',populate:{path:'answers',model:'Answers'}})
    .exec(function(err,foundQuiz) {
        if(err) {
            console.log(err);
        } else {
            res.render('./play/test',{
                quiz:foundQuiz,
                score:score
            });
        }
    });
});

router.get('/quiz/:id/result',middleObject.isLoggedIn,(req,res) => {
    res.render('./play/result',{
        score:req.session.score,
        selected:req.session.answer,
        user:res.locals.currentUser
    });
});
module.exports = router;