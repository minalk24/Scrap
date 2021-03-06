// =====================
// Dependencies
// =====================
// load the mongoose node package - an object modeling tool 
// or object-document mapper (ODM) for MongoDB
var mongoose = require("mongoose");

// =====================
// Create a mongoose Schema
// =====================
// store a reference of the mongoose Schema constructor
// into a variable called "Schema"
var Schema = mongoose.Schema;

// create a new Schema and store in a variable
var NoteSchema = new Schema({
    body: {
        type: String,
        index: true
    }
});

// =====================
// Create a mongoose model 
// =====================
// create the "article" model by the schema defined above,
// uing the mongoose model method
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;