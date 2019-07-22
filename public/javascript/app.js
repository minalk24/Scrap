$("#scrape").on("click", function (event) {
    // prevent the page to refresh
    event.preventDefault();

    // GET request to scrape the NYT website
    $.ajax("/scrape", {
        method: "GET"
    }).then(function () {
        // reload so the articles are displayed
        location.reload();
    });
});

// event listener on the "delete" button to delete the unsaved articles
$("#delete").on("click", function (event) {
    // prevent the page to refresh
    event.preventDefault();

    // post request to delete the articles that haven't been saved
    $.ajax("/delete-articles", {
        method: "POST"
    }).then(function () {
        // reload the page
        location.reload();
    });
})

//save button
$(document).on("click", ".save-button", function (event) {
    // prevent the page to refresh
    event.preventDefault();

    // grab the id of the article whose button has been clicked
    var articleID = $(this).data("id");
    // console.log(articleID);

    // put request to update the value of "save" in the Article collection
    $.ajax("/save-article/" + articleID, {
        method: "POST"
    }).then(function () {
        // reload so the articles are displayed
        location.reload();
    });

});

//  "delete-saved-article" button to delete the saved articles
$(document).on("click", ".delete-saved-article", function (event) {
    // prevent the page to refresh
    event.preventDefault();

    // grab the id of the article whose button has been clicked
    var articleID = $(this).data("id");
    // console.log(articleID);

    // post request to delete the saved article whose "delete" button has been clicked
    $.ajax("/delete-article/" + articleID, {
        method: "POST"
    }).then(function () {
        // reload the page
        location.reload();
    });
});