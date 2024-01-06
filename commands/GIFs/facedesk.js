const { EmbedBuilder } = require("discord.js");

const name = "facedesk";
const desc = "Slam your face onto a desk";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "facedesk",
    slash: {
        name: name,
        description: desc
    },

    async interactionInit(interaction) {
        await interaction.deferReply();

        this.execute(interaction, 1);
    },

    async msgInit(message) {
        this.execute(message, 0);
    },

    async execute(message, type) {
        const gif = await require("../../helpers/kawaii-api").getGIF("facedesk");

        if(gif.includes("facedesk5.gif")) return this.execute(message, type);

        this.reply.send(message, type, {
            embeds: [
                new EmbedBuilder()
                .setColor(message.member.displayHexColor)
                .setDescription(`${message.member.user} slams their face onto a desk`)
                .setImage(gif)
                .setFooter({ text: "GIF provided by: kawaii.red" })
            ]
        });
    },

    reply: require("../../helpers/reply")
}