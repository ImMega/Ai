const serverModel = require("../../models/serverSchema");

module.exports = async (client, guild) => {
    if(!client.dbCmds) return;
    
    try {
        const server = await serverModel.create({
            serverId: guild.id
        });
    
        server.save();
    } catch(err) {
        console.log(err);
    }
}