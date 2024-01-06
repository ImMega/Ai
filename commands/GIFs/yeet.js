const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const name = "yeet";
const desc = "You want to yeet someone? Now you can.";

const roasts = [
    "You try to lift yourself to yeet... You're too heavy.",
    "You reach out to construction worker to yeet you with their machines... The machines broke down.",
    "You ask someone to yeet you... *they die instantly*"
];

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "yeet <someone>",
    slash: {
        name: name,
        description: desc,
        options: [
            {
                name: "user",
                type: ApplicationCommandOptionType.User,
                description: "The Discord user.",
                required: true
            }
        ]
    },

    async interactionInit(interaction) {
        await interaction.deferReply();

        const mention = interaction.options.getUser("user");

        this.execute(interaction, mention, 1);
    },

    async msgInit(message, args) {
        this.execute(message, message.mentions.users.first(), 0);
    },

    async execute(message, mention, type) {
        if(message.member.user == mention) {
            if(Math.random() > 0.8) {
                const random = Math.floor(Math.random() * roasts.length);

                this.reply.reply(message, type, { content: roasts[random] });
            } else {
                this.reply.reply(message, type, { content: "I don't think you could possibly yeet yourself alone." });
            }
        } else {
            const gif = await require("../../helpers/kawaii-api").getGIF("yeet");

            this.reply.send(message, type, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(message.guild.members.me.displayHexColor)
                    .setTitle(mention == message.guild.members.me.user ? "*disappears*" : "See ya later")
                    .setDescription(`${message.member.user} yeeted ${mention == message.guild.members.me.user ? "me" : mention}.`)
                    .setImage(gif)
                    .setFooter({ text: "Gif provided by: kawaii.red" })
                ]
            });
        }
    },

    reply: require("../../helpers/reply")
}