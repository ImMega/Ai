const { client } = require("../../index");

module.exports = {
    name: "msgReply",
    aliases: ["reply"],
    description: "Reply to a message as a bot (BOT OWNER ONLY)",
    msgInit(message, args){
        if(message.author.id != client.ownerId || !args[1]) return;
        message.delete();

        const msgId = args.shift();
        const reply = args.join(" ");

        message.channel.messages.fetch(msgId).then(msg => {
            message.channel.sendTyping();

            setTimeout(() => { msg.reply(reply) }, 3000);
        }).catch(err => { console.log(err) });
    }
}