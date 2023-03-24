const pptr = require("puppeteer");

module.exports = {
    toonily(url) {
        return new Promise(async (resolve, reject) => {
            const browser = await pptr.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto(url);

            const latestChapter = await page
                .mainFrame()
                .waitForSelector(".wp-manga-chapter")
                .then((element) => element.getProperty("textContent"));

            resolve(
                parseInt(latestChapter.toString().split(":")[1].split(" ")[1])
            );
        });
    },

    mangakakalot(url) {
        return new Promise(async (resolve, reject) => {
            const browser = await pptr.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto(url);

            const latestChapter = await page
                .mainFrame()
                .waitForSelector("li.a-h")
                .then((element) => element.getProperty("textContent"));

            resolve(
                parseInt(latestChapter.toString().split(":")[1].split(" ")[1])
            );
        });
    },
};
