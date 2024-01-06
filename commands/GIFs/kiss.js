const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const kissElse = [
    "Lucky them",
    "Shh, don't interrupt them",
    "They did it!"
];

const kissMe = [
    "W-what???",
    "I-",
    "Huh?!?"
];

const name = "kiss";
const desc = "Kiss someone";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "kiss <someone>",
    slash: {
        name: name,
        description: desc,
        options: [
            {
                name: "user",
                type: ApplicationCommandOptionType.User,
                description: "The Discord user",
                required: true
            }
        ]
    },

    async interactionInit(interaction) {
        await interaction.deferReply();

        const mention = interaction.options.getUser("user");

        this.execute(interaction, mention, 1);
    },

    async msgInit(message) {
        const mention = message.mentions.users.first();

        this.execute(message, mention, 0);
    },

    async execute(message, mention, type) {
        if(!mention) return;
        if(mention == message.member.user) return this.reply.reply(message, type, { content: "How tf do you think you'd kiss yourself???", allowedMentions: { repliedUser: false } });

        const gif = await require("../../helpers/kawaii-api").getGIF("kiss");

        const random = Math.floor(Math.random() * (mention == message.member.user ? kissMe.length : kissElse.length));

        this.reply.send(message, type, {
            embeds: [
                new EmbedBuilder()
                .setColor(message.guild.members.me.displayHexColor)
                .setTitle(mention == message.guild.members.me.user ? gif.includes("kiss11.gif") ? "Well let's- oh" : kissMe[random] : gif.includes("kiss11.gif") ? "Ouch" : kissElse[random])
                .setDescription(`${message.member.user} ${gif.includes("kiss11.gif") ? "tried to kiss" : "kissed"} ${mention == message.guild.members.me.user ? "me??" : `${mention}!`}`)
                .setImage(gif)
                .setFooter({ text: "Gif provided by: kawaii.red" })
            ]
        });
    },

    reply: require("../../helpers/reply")
}