const { EmbedBuilder } = require("discord.js");

const name = "hide";
const desc = "Hide.";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "hide",
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
        const gif = await require("../../helpers/kawaii-api").getGIF("hide");

        this.reply.send(message, type, { 
            embeds: [
                new EmbedBuilder()
                .setColor(message.guild.members.me.displayHexColor)
                .setDescription(`${message.member.user} hid away... No one shall know where they are.`)
                .setImage(gif)
                .setFooter({ text: "Gif provided by: kawaii.red" })
            ]
        });
    },

    reply: require("../../helpers/reply")
}