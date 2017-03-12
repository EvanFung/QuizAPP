var mongoose = require('mongoose');

var QuizzesSchema = new mongoose.Schema({
    name:String,
    description:String,
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Questions"
    }]
});


module.exports = mongoose.model('Quizzes',QuizzesSchema);