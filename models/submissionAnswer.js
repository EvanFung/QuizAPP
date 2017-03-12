var mongoose = require('mongoose');

var SubmissionAnswerSchema = new mongoose.Schema({
    quizSubmissions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuizSubmissions"        
    },
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }]
});

module.exports = mongoose.model('SubmissionAnswer',SubmissionAnswerSchema);