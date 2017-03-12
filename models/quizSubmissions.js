var mongoose = require('mongoose');

var QuizSubmissionsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    quiz:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quizzes"        
    },
    score:Number,
    submittedAt:{type:Date,default:Date.now}
});

module.exports = mongoose.model('QuizSubmissions',QuizSubmissionsSchema);