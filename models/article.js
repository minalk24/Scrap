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
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// =====================
// Create a mongoose model 
// =====================
// create the "article" model by the schema defined above,
// uing the mongoose model method
var Article = mongoose.model("Article", ArticleSchema);

// export it so it is available for other files
module.exports = Article; 