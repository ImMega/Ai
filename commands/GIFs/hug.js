const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const hugElse = [
    "Awww, give me one too",
    "Let me hug them too!",
    "That's so sweet",
    "Eyy, you forgot about me"
];

const hugMe = [
    "O-oh, um uh",
    "Me?",
    "I-I didn't expect this",
    "Thank you."
];

const name = "hug";
const desc = "Hug someone";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "hug <someone>",
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

        if(message.member.user == mention) return this.reply.reply(message, type, { content: "Yeaa don't be so lonely hug someone else not yourself", allowedMentions: { repliedUser: false } });

        const gif = await require("../../helpers/kawaii-api").getGIF("hug");

        const random = Math.floor(Math.random() * (mention == message.guild.members.me.user ? hugMe.length : hugElse.length));

        this.reply.send(message, type, { embeds: [
            new EmbedBuilder()
            .setColor(message.guild.members.me.displayHexColor)
            .setTitle(mention == message.guild.members.me.user ? gif.includes("hug17.gif") ? "Sorry, not now" : hugMe[random] : gif.includes("hug17.gif") ? "Umm, that was unexpected" : hugElse[random])
            .setDescription(`${message.member.user} gave ${mention == message.guild.members.me.user ? "me ": `${mention}`} a hug! ${gif.includes("hug17.gif") ? "Or... at least they tried to..." : ""}`)
            .setImage(gif)
            .setFooter({ text: "Gif provided by: kawaii.red" })
        ] });
    },

    reply: require("../../helpers/reply")
}