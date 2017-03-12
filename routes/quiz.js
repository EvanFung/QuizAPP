const express = require('express');
var router = express.Router();
var Quiz = require('../models/quizzes');
var Question = require('../models/questions');
var Answer = require('../models/answers');
const middlewareObj = require('../middleware/index');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
router.all('/*',middlewareObj.requiresAdmin());
//show all quizs page
router.get('/',middlewareObj.isLoggedIn,(req,res) => {
    Quiz.find({},(err,quizzes) => {
        if(err) {
            console.log(err);
        } else {
           res.render('./quiz/quizzes',{quizzes:quizzes}); 
        }
    });
});


//handle post new quizzes
router.post('/',(req,res) => {
    var quizname = req.body.quizname,
        description = req.body.description;
    var newQuiz = {name:quizname,description:description};
    Quiz.create(newQuiz,(err,newQuiz) => {
        if(err) {
            console.log(err);
        } else {
            req.flash('success','Successfully added quiz');
            res.redirect('./quiz')
        }
    });
});

router.delete('/:id',(req,res) => {
    Quiz.findByIdAndRemove(req.params.id,(err) => {
        if(err) {
            console.log(err);
        } else {
            req.flash('success','Successfully deleted quiz');
            res.redirect('./');
        }
    });
});


//handle show edit route
router.get('/:id/edit',(req,res) => {
    Quiz.findById(req.params.id,function(err,quiz) {
       if(err) {
           console.log(err);
       } else {
          Question.find({quizzes:quiz._id},function(err,questions) {
              if(err) {
                  console.log(err);
              } else {
                  res.render('./quiz/edit',{quiz:quiz,questions:questions});
              }
          });
       }
    });
});

//delete question route
router.delete('/:quizId/:questionId/:answerId/question',(req,res) => {
    var questionID = req.params.questionId;
    var answerID = req.params.answerId;
    Question.findByIdAndRemove(questionID,function(err) {
        if(err) {
            console.log(err);
        } else {
            Answer.findByIdAndRemove(answerID,function(err) {
                if(err) {
                    console.log(err);
                } else {
                    req.flash('success','Successfully deleted question');
                    res.redirect('/quiz/' + req.params.quizId + '/edit');
                }
            });
        }
    });
});


//updated question route
router.put('/:quizid/edit/question/:questionid',(req,res) => {
    var name = req.body.questiontext;
    // res.send(name);
    Question.findByIdAndUpdate(req.params.questionid,{question:name},function(err,question) {
        if(err) {
            console.log(err);
        } else {
            req.flash('success','Successfully updated question');
            res.redirect('/quiz/' + req.params.quizid + '/edit');
        }
    });
});

//handle edit quiz route
router.put('/:id',(req,res) => {
    Quiz.findByIdAndUpdate(req.params.id,req.body.quiz,function(err,updatedQuiz) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/quiz/' + req.params.id + '/edit');
        }
    });
});

//handle add question to specific quiz route
router.post('/:id',(req,res) => {
    var questionText = req.body.questiontext;
    var correctIndex = req.body.correct;
    //answer array
    var answerArr = req.body.answer;
    var correctAnswer = answerArr[correctIndex];
    var newQuestion = {question:questionText,quizzes:req.params.id};
    Question.create(newQuestion,function(err,newQuestion) {
        if(err) {
            console.log(err);
        } else {
            var answer = {
                answer:answerArr,
                correct:correctAnswer,
                question:newQuestion._id
            };
            Answer.create(answer,function(err,newAnswer) {
                if(err) {
                    console.log(err);
                } else {
                    newQuestion.answers = newAnswer._id;
                    newQuestion.save();
                    
                    //push the new question to quiz
                    Quiz.findById(req.params.id,function(err,quiz) {
                        if(err) {
                            console.log(err);
                        } else {
                            quiz.questions.push(newQuestion._id);
                            quiz.save();
                            req.flash('success','Successfully added question to the quiz');
                            res.redirect('/quiz/' + req.params.id + '/edit');
                        }
                    });
                }
            });
        }
    });
});
//show edit answer page
router.get('/:quizid/question/:questionid/answer/:answerid',(req,res) => {
    var qid = req.params.questionid;
    var answerid = req.params.answerid;
    var quizid = req.params.quizid;
    Question.findById(qid,function(err,question) {
        if(err) {
            console.log(err);
        } else {
            Answer.findById(question.answers,function(err,answer) {
                if(err) {
                    console.log(err);
                } else {
                  var correctIndex = answer.answer.indexOf(answer.correct);
                  res.render('./quiz/editanswer',{question:question,answer:answer,index:correctIndex,quizid:quizid,aObject:answer}); 
                }
            });
        }
    });
});


router.put('/:quizid/question/:questionid/answer/:answerid',(req,res) => {
    var answerArr = req.body.answer;
    var correctIndex = req.body.correct;
    var correct = answerArr[correctIndex];
    Answer.findByIdAndUpdate(req.params.answerid,{answer:answerArr,correct:correct},function(err,updatedAnswer) {
        if(err) {
            console.log(err);
        } else {
            req.flash('success','Successfully updated answer');
            res.redirect('/quiz/'+req.params.quizid+'/question/'+req.params.questionid+'/answer/'+req.params.answerid);
        }
    });
});

module.exports = router;