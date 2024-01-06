const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require("discord.js");

const name = "character";
const desc = "Search for an anime character";

module.exports = {
    name: name,
    aliases: ["char"],
    description: desc,
    usage: "character <name>",
    async interactionInit(interaction) {
        await interaction.deferReply();

        const id = interaction.user.id;
        const query = interaction.options.getString("name");

        this.execute(interaction, id, query, 1)
    },

    async msgInit(message, args) {
        const id = message.author.id;
        const query = args.join(" ");

        this.execute(message, id, query, 0);
    },

    async execute(message, id, query, type){
        const { anilist } = require("../../index");
        
        if(!query) return this.reply.reply(message, type, { content: "You have to enter name of a character to search", allowedMentions: { repliedUser: false } });

        const charSearch = await anilist.searchEntry.character(query, 1, 1);
        
        if(charSearch.characters.length < 1) return this.reply.reply(message, type, { content: "Sorry, I couldn't find anything... Maybe you misspelled it?" });

        const character = await anilist.people.character(charSearch.characters[0].id);

        let animeCount = 0;
        let mangaCount = 0;

        const animeAppearance = [];
        const mangaAppearance = [];

        for(let i =0; i < character.media.length; i++) {
            if(character.media[i].type === "ANIME") {
                animeCount++;
                animeAppearance.push(`\`${character.media[i].title.romaji}\``);
            }

            if(character.media[i].type === "MANGA") {
                mangaCount++;
                mangaAppearance.push(`\`${character.media[i].title.romaji}\``);
            }
        }

        const row = (disabled) => {
            return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId("desc").setLabel("Description").setStyle("Primary").setDisabled(disabled),
                new ButtonBuilder().setCustomId("appear").setLabel("Appearances").setStyle("Primary").setDisabled(disabled)
                )
        }

        const embed = new EmbedBuilder()
        .setColor(message.guild.members.me.displayHexColor)
        .setTitle(character.name.english)
        .setDescription(!character.name.alternative == null && character.name.alternative.length > 0 ? `**Alternative Names:** ${character.name.alternative.join(", ")}\n \u200b` : "\u200b")
        .setThumbnail(character.image.large)
        .addFields([
            { name: "Favourites", value: character.favourites.toString(), inline: true },
            { name: "Native", value: character.name.native, inline: true },
            { name: "First Appearance", value: character.media[0].title.romaji, inline: true }
        ])
        .setURL(character.siteUrl)
        .setFooter({ text: "Powered by: anilist.co" });

        const reply = await this.reply.send(message, type, { embeds: [embed], components: [row(false)] });

        const filter = i => i.user.id == id;

        const collector = await reply.createMessageComponentCollector({ filter, time: 15000 });

        let page = "main";

        collector.on("collect", async i => {
            switch(i.customId) {
                case "desc":
                    if(page == "main" || page == "appear") {
                        await i.update({ embeds: [
                            new EmbedBuilder()
                            .setColor(message.guild.members.me.displayHexColor)
                            .setTitle(character.name.english)
                            .setThumbnail(character.image.large)
                            .setURL(character.siteUrl)
                            .setDescription(character.description.replace(/<br>/g, ``).replace(/<i>/g, `*`).replace(/<\/i>/g, `*`).replace(/~!/g, `||`).replace(/!~/g, `||`).replace(/__/g, "**"))
                            .setFooter({ text: "Powered by: anilist.co" })
                        ] });
                        page = "desc";
                    } else if(page == "desc") {
                        await i.update({ embeds: [embed] });
                        page = "main";
                    }
                    break;
                case "appear":
                    if(page == "main" || page == "desc") {
                        await i.update({ embeds: [
                            new EmbedBuilder()
                            .setColor(message.guild.members.me.displayHexColor)
                            .setTitle(character.name.english)
                            .setThumbnail(character.image.large)
                            .setURL(character.siteUrl)
                            .setDescription(`Appears in **${animeCount}** anime and **${mangaCount}** manga.`)
                            .addFields([
                                { name: "Anime", value: animeCount == 0 ? "none" : animeAppearance.join(", ") },
                                { name: "Manga", value: mangaCount == 0 ? "none" : mangaAppearance.join(", ") }
                            ])
                            .setFooter({ text: "Powered by: anilist.co" })
                        ] });
                        page = "appear";
                    } else if(page == "appear") {
                        await i.update({ embeds: [embed] });
                        page = "main";
                    }
                    break;
            }
        });

        collector.on("end", async collected => {
            await reply.edit({ components: [row(true)] });
        });
    },

    reply: require("../../helpers/reply")
}