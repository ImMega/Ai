const { EmbedBuilder } = require("discord.js");
const profileModel = require("../../models/profileSchema");

const name = "alprofile";
const desc = "Searches for an Anilist user";

module.exports = {
    name: name,
    aliases: ["alpf", "aluser"],
    description: desc,
    usage: "alprofile <username>",
    async interactionInit(interaction) {
        await interaction.deferReply();

        const id = interaction.user.id;
        const mention = interaction.options.getUser("user");
        const query = interaction.options.getString("username");

        this.execute(interaction, id, mention, query, 1)
    },

    async msgInit(message, args) {
        const id = message.author.id;
        const mention = message.mentions.users.first();
        const query = args[0];

        this.execute(message, id, mention, query, 0);
    },

    async execute(message, id, mention, query, type) {
        const { client } = require("../../index");

        try {
            if(!query) {
                if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled.\nTho you can still search for AniList users, so that's something!" });

                const profile = await profileModel.findOne({ userId: id });
    
                if(!profile || !profile.al) return this.reply.reply(message, type, { content: "You have to search for a user or bind your own profile!" });
    
                await this.alGetAndSendEmbed(message, profile.al, type);
            } else {
                if(mention) {
                    if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled.\nTho you can still search for AniList users, so that's something!" });
                    
                    const profile = await profileModel.findOne({ userId: mention.id });
    
                    if(!profile || !profile.al) return this.reply.reply(message, type, { content: "That person doesn't have their AniList binded." });
    
                    await this.alGetAndSendEmbed(message, profile.mal, type);
                } else {
                    await this.alGetAndSendEmbed(message, query, type);
                }
            }
        } catch(err) {
            require("../../helpers/errorLogging")(message, err);

            return this.reply.reply(message, type, { content: "Sorry, some error occured so I was unable to fetch your AniList..." });
        }
    },

    async alGetAndSendEmbed(message, query, type) {
        const { anilist } = require("../../index");

        const userSearch = await anilist.searchEntry.user(query, 1, 1);
        if(userSearch.users.length < 1) return this.reply.reply(message, type, { content: "Sorry, I couldn't find anything..." });

        const user = await anilist.user.profile(userSearch.users[0].id);
        const userStats = await anilist.user.stats(userSearch.users[0].id);

        const embed = new EmbedBuilder()
        .setColor(message.guild.members.me.displayHexColor)
        .setTitle(user.name)
        .setDescription("\u200b")
        .setURL(user.siteUrl)
        .setThumbnail(user.avatar.large)
        .addFields([
            { name: "Anime", value: `Count: **${userStats.anime.count}**\nMean Score: **${userStats.anime.meanScore}**\nDays Watched: **${((userStats.anime.minutesWatched / 60) / 60).toFixed(1)}**\nEpisodes Watched: **${userStats.anime.episodesWatched}**`, inline: true },
            { name: "Manga", value: `Count: **${userStats.manga.count}**\nMean Score: **${userStats.manga.meanScore}**\nChapters Read: **${userStats.manga.chaptersRead}**\nVolumes Read: **${userStats.manga.volumesRead}**`, inline: true },
            { name: "Favourites", value: `\u200b\n${user.favourites.anime.length > 0 ? `**Anime:** ${user.favourites.anime.map(a => { return `\`${a.title.romaji}\`` }).join(", ")}` : ""}${user.favourites.manga.length > 0 ? `\n\u200b\n**Manga:** ${user.favourites.manga.map(m => { return `\`${m.title.romaji}\`` }).join(", ")}` : ""}` }
        ])
        .setFooter({ text: "Powered by: anilist.co" })

        this.reply.send(message, type, { embeds: [embed] });
    },

    reply: require("../../helpers/reply")
}