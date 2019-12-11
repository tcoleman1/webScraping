const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({

    author: {
        type: String,
        required: true,
        trim: true
    },

    body: {
        type: String,
        required: true,
        trim: true
    }
});

const Note = mongoose.model("Note", NoteSchema)

module.exports = Note;