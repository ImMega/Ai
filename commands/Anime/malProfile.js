const { EmbedBuilder } = require("discord.js");
const jikan = require("@mateoaranda/jikanjs");
const profileModel = require("../../models/profileSchema");

const name = "malprofile";
const desc = "Searches for a MAL user";

module.exports = {
    name: name,
    aliases: ["malpf", "maluser"],
    description: desc,
    usage: "malprofile <username>",
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
                if(mention) {
                    if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled.\nTho you can still search for MAL users, so that's something!" });

                    const profile = await profileModel.findOne({ userId: mention.id });
    
                    if(!profile || !profile.mal) return this.reply.reply(message, type, { content: "That person doesn't have their MAL binded." });
    
                    await this.malGetAndSendEmbed(message, profile.mal, type);
                } else {
                    if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled.\nTho you can still search for MAL users, so that's something!" });

                    const profile = await profileModel.findOne({ userId: id });
    
                    if(!profile || !profile.mal) return this.reply.reply(message, type, { content: "You have to search for a user or bind your own profile!" });
        
                    await this.malGetAndSendEmbed(message, profile.mal, type);
                }
            } else {
                if(mention) {
                    if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled.\nTho you can still search for MAL users, so that's something!" });
                    
                    const profile = await profileModel.findOne({ userId: mention.id });
    
                    if(!profile || !profile.mal) return this.reply.reply(message, type, { content: "That person doesn't have their MAL binded." });
    
                    await this.malGetAndSendEmbed(message, profile.mal, type);
                } else {
                    await this.malGetAndSendEmbed(message, query, type);
                }
            }
        } catch(err) {
            require("../../helpers/errorLogging")(message, err);

            return this.reply.reply(message, type, { content: "Sorry, some error occured so I was unable to fetch your MAL..." });
        }
    },
    async malGetAndSendEmbed(message, query, type) {
        try {
            const user = await jikan.loadUser(query, "full");

            if(user.status) throw user.status;

            const embed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayHexColor)
            .setTitle(user.data.username)
            .setDescription("\u200b")
            .setURL(user.data.url)
            .setThumbnail(user.data.images.jpg.image_url)
            .addFields([
                { name: "Anime", value: `Count: **${user.data.statistics.anime.completed}**\nMean Score: **${user.data.statistics.anime.mean_score}**\nDays Watched: **${user.data.statistics.anime.days_watched}**\nEpisodes Watched: **${user.data.statistics.anime.episodes_watched}**`, inline: true},
                { name: "Manga", value: `Count: **${user.data.statistics.manga.completed}**\nMean Score: **${user.data.statistics.manga.mean_score}**\nDays Read: **${user.data.statistics.manga.days_read}**\nChapters Read: **${user.data.statistics.manga.chapters_read}**\nVolumes Read: **${user.data.statistics.manga.volumes_read}**`, inline: true },
                { name: "Favourites", value: `\u200b\n${user.data.favorites.anime.length > 0 ? `**Anime:** ${user.data.favorites.anime.map(a => { return `\`${a.title}\`` }).join(", ")}` : ""}${user.data.favorites.manga.length > 0 ? `\n\u200b\n**Manga:** ${user.data.favorites.manga.map(m => { return `\`${m.title}\`` }).join(", ")}` : ""}` }
            ])
            .setFooter({ text: "Powered by: myanimelist.net" })

            this.reply.send(message, type, { embeds: [embed] });
        } catch(err) {
            require("../../helpers/errorLogging")(message, err);
            
            if(err.toString().includes("404")) {
                return this.reply.reply(message, type, { content: "Sorry, couldn't find anything..." });
            } else if(err.toString().includes("Idle timeout reached")) {
                return this.reply.reply(message, type, { content: "Sorry, MAL kinda didn't respond on time. You can try again if you want" });
            } else {
                return this.reply.reply(message, type, { content: "Sorry, some error occured so I was unable to fetch your MAL..." });
            }
        }
    },

    reply: require("../../helpers/reply")
}