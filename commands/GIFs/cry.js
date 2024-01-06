const { EmbedBuilder } = require("discord.js");

const name = "cry";
const desc = "Cry, if you really need to...";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "cry",
    slash: {
        name: name,
        description: desc
    },

    async interactionInit(interaction) {
        await interaction.deferReply();

        this.execute(interaction, 1);
    },

    async msgInit(message, args) {
        this.execute(message, 0);
    },

    async execute(message, type) {
        const gif = await require("../../helpers/kawaii-api").getGIF("cry");

        this.reply.send(message, type, {
            embeds: [
                new EmbedBuilder()
                .setColor(message.member.displayHexColor)
                .setDescription(`${message.member.user} broke down crying... Poor thing...`)
                .setImage(gif)
                .setFooter({ text: "GIF provided by: kawaii.red" })
            ]
        });
    },

    reply: require("../../helpers/reply")
}