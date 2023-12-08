const serverModel = require("../../models/serverSchema");

module.exports = async (client, interaction) => {
    if(!interaction.isCommand()) return;

    client.commands.get(interaction.commandName).interactionInit(interaction);

    if(!client.dbCmds) return;

    let serverData;
    try {
        serverData = await serverModel.findOne({ serverId: interaction.guild.id });

        if(!serverData) {
            const server = await serverModel.create({
                serverId: interaction.guild.id
            });

            server.save();
        }
    } catch(err) {
        console.log(err);
    }
}