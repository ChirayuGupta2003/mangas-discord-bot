const { SlashCommandBuilder } = require("discord.js");
const { toonily, mangakakalot } = require("../scraper.js");
const manga = require("../models/manga.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-manga")
        .setDescription("Adds a manga to notify")
        .addStringOption((option) =>
            option
                .setName("provider")
                .setDescription("Set the manga provider")
                .addChoices(
                    { name: "Toonily", value: "toonily" },
                    { name: "Mangakakalot", value: "mangakakalot" }
                )
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("url")
                .setDescription("url for manga")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const provider = interaction.options.getString("provider").toLowerCase();
        const url = interaction.options.getString("url");

        let latestChapter;

        if (provider == "toonily") {
            latestChapter = await toonily(url);
        } else {
            latestChapter = await mangakakalot(url);
        }

        console.log(latestChapter);

        await manga.create({
            url: url,
            latestChapter: latestChapter,
            userID: interaction.user.id,
            provider: provider
        });

        await interaction.editReply("Done");
    },
};
