var mongoose = require('mongoose');

var QuestionsSchema = new mongoose.Schema({
    question:String,
    answers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Answers"
    }],
    quizzes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quizzes"
    }]
});


module.exports = mongoose.model('Questions',QuestionsSchema);