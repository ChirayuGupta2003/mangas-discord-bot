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
        return new Promise((resolve, reject) => {
            axios.get(url).then((res) => {
                const root = parse(res.data.toString());
                resolve(
                    parseInt(
                        root.querySelector(".a-h > a").innerHTML.split(" ")[1]
                    )
                );
            });
        });
    },
};
