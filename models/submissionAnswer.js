var mongoose = require('mongoose');

var SubmissionAnswerSchema = new mongoose.Schema({
    quizSubmissions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizSubmissions"        
    },
    answers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Answers"
    }],
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }]
});

module.exports = mongoose.model('SubmissionAnswer',SubmissionAnswerSchema);