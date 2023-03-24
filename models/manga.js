const { Schema, model } = require("mongoose");

const mangaSchema = new Schema({
    url: String,
    latestChapter: Number,
    userID: String,
    provider: String,
});

module.exports = model("manga", mangaSchema);
