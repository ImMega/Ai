const { client } = require("../../index")

module.exports = {
    name: "devexclusive",
    aliases: [],
    description: "Enable/disable developer exclusive mode (BOT OWNER ONLY)",
    msgInit(message, args){
        if(message.author.id != client.ownerId) return;

        if(client.development) client.development = false;
        if(!client.development) client.development = true;

        message.reply(`Developer exclusive mode toggled **${client.development ? "ON" : "OFF"}**`);
    }
}