const mongoose = require('mongoose');
const quiz = mongoose.Schema({
        name: String,
        questions: Array,
        description: String,
        authorId: String,
});
module.exports = mongoose.model('Quiz', quiz); 