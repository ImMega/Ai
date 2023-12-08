const { EmbedBuilder } = require("discord.js");

const serverModel = require("../../models/serverSchema");

const checkCount = async (client, message) => {
    if(!client.dbCmds) return;

    let serverData = await serverModel.findOne({ serverId: message.guild.id });

    if(!serverData || !serverData.countChId) return;
    if(message.channel.id !== serverData.countChId) return;

    if(message.author.bot) return message.delete();

    require("../../helpers/counting")(message);
}

module.exports = async (client, message) => {
    if(message.guild == null && message.author.id != client.user.id && message.author.id != "470277450551656459") {
        const owner = await (await client.guilds.fetch("764209422620688404")).fetchOwner();
        const OwnerDM = await owner.createDM(true);

        OwnerDM.send({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ iconURL: message.author.displayAvatarURL({ dynamic: true }), name: message.author.username + "#" + message.author.discriminator })
                .setDescription(message.content)
            ]
        });
    }

    if(client.developing && message.author.id != "470277450551656459") return;
    if(message.guild) checkCount(client, message);

    if(!message.content.startsWith(client.prefix) || message.author.bot) return;

    const args = message.content.slice(client.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.cmdaliases.get(command));

    if(cmd) cmd.msgInit(message, args);

    if(!client.dbCmds) return;

    let serverData;
    try {
        serverData = await serverModel.findOne({ serverId: message.guild.id });

        if(!serverData) {
            const server = await serverModel.create({
                serverId: message.guild.id
            });

            server.save();
        }
    } catch(err) {
        console.log(err);
    }
}