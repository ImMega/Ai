const serverModel = require("../../models/serverSchema");

const name = "countchannel";
const desc = "Sets a counting channel so the bot can see if you know how to count (ADMIN ONLY)";

module.exports = {
    name: name,
    aliases: ["countch"],
    description: desc,
    usage: "countchannel <channel>",
    async interactionInit(interaction) {
        await interaction.deferReply();

        const channel = interaction.options.getChannel("channel");

        this.execute(interaction, channel, 1);
    },

    async msgInit(message, args){
        const channelId = args[0].replace("<#", "").replace(">", "");

        const channel = await message.guild.channels.cache.get(channelId);

        this.execute(message, channel, 0);
    },

    async execute(message, channel, type) {
        if(!message.member.permissions.has("ADMINISTRATOR")) return;

        const { client } = require("../../index");

        if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled." });

        if(!channel) return this.reply.reply(message, type, { content: "Channel with that ID does not exist in this server." });

        try {
            await serverModel.findOneAndUpdate({ serverId: message.guild.id }, { countChId: channel.id }); 

            this.reply.reply(message, type, { content: `<#${channel.id}> successfully set as counting channel!` });
        } catch(err) {
            require("../../helpers/errorLogging")(message, err);

            return this.reply.reply(message, type, { content: "Sorry, some error occured so I was unable to set counting channel..." });
        }
    },

    reply: require("../../helpers/reply")
}