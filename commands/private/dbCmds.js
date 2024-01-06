const { client } = require("../../index")

module.exports = {
    name: "dbcmds",
    aliases: [],
    description: "Enable/disable commands that require database (BOT OWNER ONLY)",
    msgInit(message, args){
        if(message.author.id != client.ownerId) return;

        if(client.dbCmds) client.dbCmds = false;
        if(!client.dbCmds) client.dbCmds = true;

        message.reply(`Database related commands toggled **${client.dbCmds ? "ON" : "OFF"}**`);
    }
}