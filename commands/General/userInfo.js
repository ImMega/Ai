const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const name = "userinfo";
const desc = "Check your or someone's Discord profile info";

const status = {}

module.exports = {
    name: name,
    aliases: ["ui"],
    description: desc,
    usage: "userinfo [mention]",
    slash: {
        name: name,
        description: desc,
        options: [
            {
                name: "user",
                type: ApplicationCommandOptionType.User,
                description: "A Discord user"
            }
        ]
    },

    async msgInit(message, args) {
        let member = await message.guild.members.fetch(message.mentions.users.first());
        if(!message.mentions.users.first()) member = message.member;

        this.execute(message, member, 0);
    },

    async interactionInit(interaction) {
        await interaction.deferReply();

        let member = await interaction.guild.members.fetch(interaction.options.getUser("user"));
        if(!interaction.options.getUser("user")) member = interaction.member;

        this.execute(interaction, member, 1);
    },

    async execute(message, member, type) {
        const user = member.user;

        let onlineState;
        switch(member.presence ? member.presence.status : "offline") {
            case "online":
                onlineState = "🟢 Online";
                break;
            case "idle":
                onlineState = "🟠 Idle";
                break;
            case "dnd":
                onlineState = "🔴 Online (Do Not Disturb)";
                break;
            case "offline":
                onlineState = "⭕ Offline";
                break;
        }

        this.reply.reply(message, type, {
            embeds: [
                new EmbedBuilder()
                .setColor(member.displayHexColor)
                .setAuthor({ iconURL: user.displayAvatarURL({ dynamic: true }), name: user.username + "#" + user.discriminator + `${user.id == member.guild.ownerId ? " (Owner)" : ""}` + `${user.bot ? " (Bot)" : ""}` })
                .setTitle("User Info")
                .setDescription(`${(member.communicationDisabledUntilTimestamp && message.createdTimestamp < member.communicationDisabledUntilTimestamp) ? `**Muted Until:** <t:${(member.communicationDisabledUntilTimestamp / 1000).toFixed(0)}>\n\n` : ""}`
                + `${user.username == member.displayName ? "" : `**Server Nickname:** ${member.displayName}\n\n`}`
                + `**State:\u200b** ${onlineState}\n\n`
                + `**Joined Discord:** <t:${(user.createdTimestamp / 1000).toFixed(0)}>\n`
                + `**Joined server:** <t:${(member.joinedTimestamp / 1000).toFixed(0)}>\n\n`
                + `**Roles:** ${member.roles.cache.map(r => ` <@&${r.id}>`)}`)
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            ]
        });
    },

    reply: require("../../helpers/reply")
}