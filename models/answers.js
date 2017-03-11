var mongoose = require('mongoose');

var AnswersSchema = new mongoose.Schema({
    answer:[String],
    correct:String,
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }
});

module.exports = mongoose.model('Answers',AnswersSchema);