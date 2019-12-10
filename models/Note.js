const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = newSchema({

    noteText: String,
});

const Note = mongoose.model("Note", NoteSchema)

module.exports = Note;