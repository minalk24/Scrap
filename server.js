// =============================
// Connect to the MongoDB
// =============================
// If deployed, use the deployed database. Otherwise use the local database called "newsArticles"
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsArticles";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

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
var db = require("/models");


// =============================
// Configuration of the Express app
/// =============================

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
// Routes
// =============================

// define the route to display the home page
app.get("/", function(req, res) {
    res.render("index");
});

// define route to get all the articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Article collection
    db.Article.find({})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// define the route to scrape NYT website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function(i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
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

        // Send a message to the client
        res.send("Scrape Complete");
    });
});

// =============================
// Start the server
// =============================

// so that it can begin listening to client requests.
app.listen(PORT, function() {
    console.log("App listening on: http://localhost:" + PORT);
}); 