const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const name = "help";
const desc = "Shows command list or information about a specific command";

module.exports = {
    name: name,
    aliases: ["?"],
    description: desc,
    usage: "help [command]",
    slash: {
        name: name,
        description: desc,
        options: [
            {
                name: "command",
                type: ApplicationCommandOptionType.String,
                description: "This bot's command"
            }
        ]
    },

    async interactionInit(interaction) {
        await interaction.deferReply();

        this.execute(interaction, interaction.options.getString("command"), 1);
    },

    async msgInit(message, args) {
        this.execute(message, args[0], 0);
    },

    execute(message, command, type) {
        const { client } = require("../../index");
        
        if(!command) {
            const embed = new EmbedBuilder()
            .setColor(message.guild.members.me.displayHexColor)
            .setTitle(`${client.user.username} Command List`)
            .setDescription(`To see some more info about a specific command do \`${client.prefix + this.usage}\``)
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setFooter({ iconURL: client.user.avatarURL({ dynamic: true }), text: `${client.user.username} Command List` })

            client.categories.forEach(cat => embed.addFields({ name: cat.name, value: `\`${cat.cmds.join("` - `")}\`` }));

            this.reply.send(message, type, { embeds: [embed] });
        } else {
            const cmd = client.commands.get(command) || client.commands.get(client.cmdaliases.get(command));

            if(!cmd) return this.reply.reply(message, type, { content: `I do not have that \`${command}\` command, sorry.` });

            this.reply.send(message, type, {
                embeds: [
                    new EmbedBuilder()
                    .setColor(message.guild.members.me.displayHexColor)
                    .setTitle(client.prefix + cmd.name)
                    .setDescription(`${cmd.description}\n\n${cmd.aliases.length > 0 ? `**Aliases:** \`${cmd.aliases.join(", ")}\`\n\n` : ""}**Usage:** \`${cmd.usage}\``)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                ]
            });
        }
    },

    reply: require("../../helpers/reply")
}