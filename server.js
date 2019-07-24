// =============================
// Dependencies
// =============================

// load the Express node package - the web framework
var express = require("express");

// load the handlebars node package for Express - the templating engine
var exphbs = require("express-handlebars");

// load the mongoose node package - an object modeling tool 
// or object-document mapper (ODM) for MongoDB
var mongoose = require("mongoose");

// load the axios node package to be able to make requests
var axios = require("axios");

// load the cheerio node package to 
var cheerio = require("cheerio");

// load the MongoDB models
var db = require("./models");

// =============================
// Configuration of the Express app
// =============================

// create an Express app
var app = express();

// set the port of the application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 3000;

// set up the Express app to handle data parsing - parse data as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up the Express app so it will be able to use my css stylesheet, the images and the js file
// by generating a route itself for everything within the "public" folder
app.use(express.static("public"));

// =============================
// Set handlebars as the default templating engine
// =============================

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// =============================
// Connect to the MongoDB
// =============================

// If deployed, use the deployed database. Otherwise use the local database called "newsArticles"
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsArticles";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
 
// =============================
// Routes
// =============================

// define the route to display the "home" page
app.get("/", function(req, res) {
    db.Article.find({saved: false})
        .then(function(dbArticle) {
            var hbsObj = {
                data: dbArticle
            }
            console.log(hbsObj);
            // If we were able to successfully find Articles
            // render the page with the data
            res.render("index", hbsObj);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        })
});

// define the route to display the "saved articles" page
app.get("/saved-articles", function(req, res) {
    db.Article.find({saved:true})
        .populate("note")
        .then(function(dbArticle) {
            var hbsObj = {
                data: dbArticle
            }
            // console.log("asghasgdjasda",dbArticle[0].note[0]);
            // If we were able to successfully find Articles
            // render the page with the data
            res.render("saved-articles", hbsObj);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        })
});

// define the route to scrape NYT website
app.get("/scrape", function(req, res) {
    // grab the body of the html with axios
    axios.get("https://www.nytimes.com/").then(function(response) {
        // load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
  
        // grab every a tag within article tag, and do the following:
        $("article a").each(function(i, element) {
            // Save an empty result object
            var result = {};
  
            // Add the title and href of every link + the summary of every article 
            // and save them as properties of the result object
            result.title = $(this)
                .children("div")
                .children("h2")
                .text();
            result.url = $(this)
                .attr("href");
            result.summary = $(this)
                .children("p")
                .text();
  
            // Create new documents within the "Article" collection using the `result` object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, log it
                    console.log(err);
                })
        });
        // redirect to the root route
        res.redirect("/");
    });
});

// define the route to delete all the articles that haven't been saved
app.post("/delete-articles", function(req, res) {
    // delete many - all the unsaved article
    db.Article.deleteMany({saved: false})
        .then(function(dbArticle) {
            // View the updated result in the console
            console.log(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        })

    // redirect to the root route
    res.redirect("/");
});

// define the route to save an article when its "save" button has been clicked
app.post("/save-article/:id", function(req, res) {
    // find and update the article corresponding to the id
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true })
        .then(function(dbArticle) {
            // View the updated result in the console
            console.log(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        })

    // end the connection
    res.end();
});

// define the route to delete a saved article
app.post("/delete-article/:id", function(req, res) {
    // delete one - the saved article whose "delete-save-article" button has been clicked
    db.Article.deleteOne({ _id: req.params.id })
        .then(function(dbArticle) {
            // View the updated result in the console
            console.log(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
        })

    // end the connection
    res.end();
});

// define the route to populate a saved article with its note
app.get("/note-article/:id", function(req, res) {
    // find one - the saved article whose "note" button has been clicked
    db.Article.findOne({ _id: req.params.id })
        // populate all of the notes associated with it
        .populate("note")
        .then(function(dbArticle) {
            // console.log("dbArticle", dbArticle)
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// define the route to save/update the note for the corresponding article
app.post("/note-article/:id", function(req, res) {
    // Create a new note with the user input
    db.Note.create(req.body)
        .then(function(dbNote) {
            // once the new note has been created, find the associate article and update its notes with the note just created
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


app.delete("/note-article/:id", function(req, res) {
   console.log("deleting note...", req.params.id);
   
    db.Note.deleteOne({ _id: req.params.id })
        .then(function(dbNote) {
             res.json(dbNote);
        })
     
});

// =============================
// Start the server
// =============================

// so that it can begin listening to client requests.
app.listen(PORT, function() {
    console.log("App listening on: http://localhost:" + PORT);
});