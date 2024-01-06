const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const serverModel = require("../../models/serverSchema");

const name = "countcheck";
const desc = "Check your or someone else's correct or wrong counts";

module.exports = {
    name: name,
    aliases: ["countchk", "count"],
    description: desc,
    usage: "countcheck [mention]",
    async msgInit(message, args) {
        let member = await message.guild.members.fetch(message.mentions.users.first());
        if(!message.mentions.users.first()) member = message.member;

        this.execute(message, member, 0);
    },

    async interactionInit(interaction) {
        await interaction.deferReply();

        let member = await interaction.guild.members.fetch(interaction.options.getUser("user"));
        if(!interaction.options.getUser("user")) member = interaction.member;

        this.execute(interaction, member, 1);
    },

    async execute(message, member, type) {
        const { client } = require("../../index");

        if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled.\nYes, that also means I won't be able to keep count of your counts 😔" });

        let serverData;
        try {
            serverData = await serverModel.findOne({ serverId: message.guild.id });
    
            if(!serverData) {
                const server = await serverModel.create({
                    serverId: message.guild.id
                });
    
                server.save();
            }
    
            serverData = await serverModel.findOne({ serverId: message.guild.id });
        } catch(err) {
            console.log(err);
        }
    
        try {
            if(!serverData.members.find(m => m.userId == member.user.id)) await serverModel.findOneAndUpdate({ serverId: message.guild.id }, {
                $push: {
                    members: {
                        "userId": member.user.id,
                        "count": {
                            "correct": 0,
                            "wrong": 0
                        }
                    }
                }
            });

            const server = await serverModel.findOne({ "serverId": message.guild.id });
            
            const count = server.members.find(m => m.userId == member.user.id).count;
    
            this.reply.reply(message, type, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(member.displayHexColor)
                    .setAuthor({ name: `${member.displayName}${member.displayName == member.user.username ? "" : ` (${member.user.username})`}` })
                    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                    .setTitle("Counting")
                    .setFields([
                        { name: "Correct", value: count.correct.toString(), inline: true },
                        { name: "Wrong", value: count.wrong.toString(), inline: true },
                        { name: "Correct Rate", value: `${((count.correct / (count.correct + count.wrong)) * 100).toFixed(0)}%`, inline: true }
                    ])
                ]
            })
        } catch(err) {
            require("../../helpers/errorLogging")(message, err);

            return this.reply.reply(message, type, { content: "Sorry, some error occured so I was unable to fetch your counting..." });
        }
    },

    reply: require("../../helpers/reply")
}