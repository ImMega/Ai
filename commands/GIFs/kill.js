const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const kill = [
    "OH they ded",
    "Aw hell nawh, I'm outta here"
]

const name = "kill";
const desc = "Kill someone. (not fr tho that's illegal)";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "kill <someone>",
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
        if(mention == message.member.user) return this.reply.reply(message, type, { content: "Yeeeeaa we don't want that", allowedMentions: { repliedUser: false } });

        const gif = await require("../../helpers/kawaii-api").getGIF("kill");

        const random = Math.floor(Math.random() * kill.length);

        this.reply.send(message, type, {
            embeds: [
                new EmbedBuilder()
                .setColor(message.guild.members.me.displayHexColor)
                .setTitle(mention == message.guild.members.me.user ? gif.includes("kill9.gif") ? "Agh-" : "#@*$&UDNI#J" : gif.includes("kill9.gif") ? "And whoop, it snapped" : kill[random])
                .setDescription(`${message.member.user} got ${mention == message.guild.members.me.user ? "me" : mention} umm yea kinda ded${mention == message.guild.members.me.user ? ". Is this heaven?" : ""}`)
                .setImage(gif)
                .setFooter({ text: "Gifs provided by: kawaii.red" })
            ]
        });
    },

    reply: require("../../helpers/reply")
}