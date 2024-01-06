const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

const MAL = require("mal-scraper");

const name = "animefind";
const desc = "Searches for an anime";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "anime <title>",
    async interactionInit(interaction) {
        await interaction.deferReply();

        const id = interaction.user.id;
        const query = interaction.options.getString("title");

        this.execute(interaction, id, query, 1)
    },

    async msgInit(message, args) {
        const id = message.author.id;
        const query = args.join(" ");

        this.execute(message, id, query, 0);
    },

    async execute(message, id, query, type) {
        const { anilist } = require("../../index");

        if(!query) return this.reply.reply(message, type, { content: "You have to enter an anime to search", allowedMentions: { repliedUser: false } })

        let anime;
        let ALsearch;
        let ALanime;

        try {
            anime = await MAL.getInfoFromName(query);
            ALsearch = await anilist.searchEntry.anime(anime.title, { sort: ["POPULARITY_DESC"] }, 1, 1);
            ALanime = await anilist.media.anime(ALsearch.media[0].id);
        } catch(err) {
            return this.reply.reply(message, type, { content: "Sorry, couldn't find an anime you searched for..." })
        }

        let image;

        image = ALanime.bannerImage;

        const embed = new EmbedBuilder()
        .setColor(message.guild.members.me.displayHexColor)
        .setTitle(anime.title)
        .setThumbnail(anime.picture)
        .addFields([
            { name: "Score", value: `${anime.score}\u200b`, inline: true },
            { name: "Ranked", value: `${anime.ranked}\u200b`, inline: true },
            { name: "Popularity", value: `${anime.popularity}\u200b`, inline: true },
            { name: "Source", value: `${anime.source}\u200b`, inline: true },
            { name: "Genres", value: `${anime.genres.join(", ")}\u200b`, inline: true },
            { name: "Rating", value: `${anime.rating}\u200b`, inline: true },
            { name: "Episodes", value: `${anime.episodes}\u200b`, inline: true },
            { name: "Format", value: `${anime.type}\u200b`, inline: true },
            { name: "Season", value: `${anime.premiered}\u200b`, inline: true }
        ])
        .setURL(anime.url)
        .setImage(image)
        .setFooter({ text: "Powered by: myanimelist.net (Banner from: anilist.co)" });

        const row = (disabled) => {return new ActionRowBuilder()
        .addComponents(new ButtonBuilder().setCustomId("desc").setLabel("Description").setStyle("Primary").setDisabled(disabled))}

        const reply = await this.reply.send(message, type, { embeds: [embed], components: [row(false)] });

        const filter = i => i.customId === "desc" && i.user.id === id;

        const collector = await reply.createMessageComponentCollector({ filter, time: 15000 });

        let p = "main";

        collector.on("collect", async i => {
            if(i.customId === "desc") {
                if(p == "main") {
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(message.guild.members.me.displayHexColor)
                            .setTitle(anime.title)
                            .setDescription(anime.synopsis)
                            .setThumbnail(anime.picture)
                            .setURL(anime.url)
                            .setFooter({ text: "Powered by: myanimelist.net" })
                        ]
                    });

                    p = "desc";
                } else if(p == "desc") {
                    await i.update({ embeds: [embed] });

                    p = "main";
                }
            }
        });

        collector.on("end", async collected => {
            await reply.edit({ components: [row(true)] })
        });
    },

    reply: require("../../helpers/reply")
}