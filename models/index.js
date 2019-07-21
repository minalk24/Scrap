// export the models defined so they are available
// from other files, i.e. the server.js in this case
module.exports = {
    Article: require("./article.js"),
    Note: require("./note.js")
} 