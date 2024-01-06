const { EmbedBuilder } = require("discord.js");

const name = "confused";
const desc = "Uhhh... Confused....";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "confused",
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
        const gif = await require("../../helpers/kawaii-api").getGIF("confused");

        this.reply.send(message, type, {
            embeds: [
                new EmbedBuilder()
                .setColor(message.member.displayHexColor)
                .setDescription(`${message.member.user} kinda got confused... <:confusion:1061324276407468076>`)
                .setImage(gif)
                .setFooter({ text: "GIF provided by: kawaii.red" })
            ]
        });
    },

    reply: require("../../helpers/reply")
}