const serverModel = require("../../models/serverSchema");

module.exports = async (client, guild) => {
    if(!client.dbCmds) return;
    
    try {
        await serverModel.findOneAndDelete({ serverId: guild.id });
    } catch(err) {
        console.log(err);
    }
}