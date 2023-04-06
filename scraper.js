const axios = require("axios");
const { parse } = require("node-html-parser");

module.exports = {
    async toonily(url) {
        const result = await axios.get(url);
        const root = parse(result.data);
        return parseInt(
            root.querySelector(".wp-manga-chapter > a").innerHTML.split(" ")[1]
        );
    },

    async mangakakalot(url) {
        const result = await axios.get(url);
        const root = parse(result.data);
        return parseInt(
            root.querySelector(".a-h > a").innerHTML.split(" ")[1]
        );
    },
};
