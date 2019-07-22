$("#scrape").on("click", function(event) {
    // prevent the page to refresh
    event.preventDefault();

    // GET request to scrape the NYT website
    $.ajax("/scrape", {
        method: "GET"
    }).then(function() {
        // reload so the articles are displayed
        location.reload();
    });
});

// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#news-articles").append("<a href='https://www.nytimes.com" + data[i].url + "' target='_blank'><h4>" + data[i].title + "</h4></a><p class='mb-2'>" + data[i].summary + "</p><button class='btn btn-warning save-button mb-5' type='submit' data-id='" + data[i]._id + "'>Save Article</button><br/>");
    }
}); 

$(document).on("click", ".save-button", function(event) {
    // prevent the page to refresh
    event.preventDefault();

    // grab the id of the article whose button has been clicked
    var articleID = $(this).data("id");
    // console.log(articleID);

    // put request to update the value of "save" in the Article collection
    $.ajax("/save-article/" + articleID, {
        method: "POST"
    }).then(function() {
        // reload so the articles are displayed
        location.reload();
    });


});