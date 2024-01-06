const { client } = require("../../index")

module.exports = {
    name: "msg",
    aliases: [],
    description: "Sends message as a bot (BOT OWNER ONLY)",
    msgInit(message, args){
        if(message.author.id != client.ownerId || !args[1]) return;

        const channelId = args.shift();
        const msg = args.join(" ");

        const channel = client.channels.cache.find(ch => ch.id == channelId)

        channel.sendTyping();

        setTimeout(() => { channel.send(msg) }, 3000);
    }
}