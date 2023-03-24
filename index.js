const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const manga = require("./models/manga.js");
const { toonily, mangakakalot } = require("./scraper.js");

config();
const token = process.env.TOKEN;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

// Event Handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Commands Handler
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }
}

const mangaWorker = async () => {
    const mangas = await manga.find();
    let l;

    for (let m of mangas) {
        if (m.provider == "toonily") {
            l = await toonily(m.url);
        }

        if (m.provider == "mangakakalot") {
            l = await mangakakalot(m.url);
        }

        if (l > m.latestChapter) {
            m.latestChapter = l;
            client.users.fetch(m.userID).then((user) => {
                user.send(`New Chapter: ${l}\nURL: ${m.url}`);
            });
            m.save();
        }
    }
};

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to database");
        client.login(process.env.TOKEN).then(() => {
            setInterval(() => {
                mangaWorker();
            }, 1000 * 60 * 10);
        });
    })
    .catch((error) => {
        console.error(error);
        console.log("An error occured while connecting to database");
    });
