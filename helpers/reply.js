module.exports = {
    async send(message, type, content) {
        try {
            if(!type) {
                return message.channel.send(content);
            } else {
                return message.editReply(content);
            }
        } catch(err) {
            require("./errorLogging")(message, err);
        }
    },
    
    async reply(message, type, content) {
        try {
            if(!type) {
                return message.reply(content);
            } else {
                return message.editReply(content);
            }
        } catch(err) {
            require("./errorLogging")(message, err);
        }
    }
}