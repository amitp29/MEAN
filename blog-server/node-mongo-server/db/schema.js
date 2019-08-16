const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const blogSchema = new Schema({
    title:  { type: String, required: true },
    author: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    body:   { type: String, required: true },
    date: { type: Date, default: Date.now }, // https://mongoosejs.com/docs/tutorials/dates.html
    hidden: { type: Boolean, required: true },
    meta: {
        votes: Number,
        likes:  Number,
        dislikes:  Number
    }
});

module.exports = blogSchema;