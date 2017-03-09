var mongoose = require('mongoose');

var QuizzesSchema = new mongoose.Schema({
    name:String,
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }]
});


module.exports = mongoose.model('Quizzes',QuizzesSchema);