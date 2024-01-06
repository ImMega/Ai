const serverModel = require("../../models/serverSchema");

const name = "removecountchannel";
const desc = "Removes a counting channel (ADMIN ONLY)";

module.exports = {
    name: name,
    aliases: ["removecountch", "rmcountch"],
    description: desc,
    usage: "removecountchannel",
    async interactionInit(interaction) {
        await interaction.deferReply();

        this.execute(interaction, 1);
    },

    async msgInit(message){
        this.execute(message, 0);
    },

    async execute(message, type) {
        if(!message.member.permissions.has("ADMINISTRATOR")) return;

        const { client } = require("../../index");

        if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled." });

        try {
            await serverModel.findOneAndUpdate({ serverId: message.guild.id }, { countChId: "" }); 

            this.reply.reply(message, type, { content: `Counting channel successfully removed!` });
        } catch(err) {
            require("../../helpers/errorLogging")(message, err);

            return this.reply.reply(message, type, { content: "Sorry, some error occured so I was unable to remove count channel..." });
        }
    },
    
    reply: require("../../helpers/reply")
}