const { client } = require("../../index")

module.exports = {
    name: "say",
    aliases: [],
    description: "Sends message as a bot (BOT OWNER ONLY)",
    msgInit(message, args){
        if(message.author.id != client.ownerId || !args[0]) return;
        message.delete();

        const msg = args.join(" ");

        message.channel.sendTyping();

        setTimeout(() => { message.channel.send(msg) }, 3000);
    }
}