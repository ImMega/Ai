const serverModel = require("../models/serverSchema");

module.exports = async (message) => {
    const lastMsg = (await message.channel.messages.fetch({ limit: 1, before: message.id })).first();
    let lastCount = lastMsg.content;

    const lastArgs = lastCount.split(/ +/);

    if(lastArgs.length == 1 && isNaN(lastCount) && message.content == 1) return;
    if(lastArgs.length == 1 && isNaN(lastCount) && message.content > 1) {
        try {
            message.delete();
            message.author.createDM().send(`You start with 1 not ${message.content}!!!`);
        } catch(err) {
            require("../helpers/errorLogging")(message, err);
        }
        return;
    }

    if(lastArgs.length > 1 && isNaN(lastArgs.find(a => !isNaN(a)))) return;
    if(lastArgs.length > 1 && !isNaN(lastArgs.find(a => !isNaN(a)))) lastCount = lastArgs.find(a => !isNaN(a));

    lastCount++;

    let num = message.content;

    const args = message.content.split(/ +/);

    if(args.length > 1) num = await args.find(s => s == lastCount)

    if(isNaN(num)) {
        try {
            const targetmsg = await message.channel.messages.fetch(message.id);
            if(!targetmsg || !targetmsg.deletable) return;

            return message.delete();
        } catch(err) {
            require("../helpers/errorLogging")(message, err);
        }
    }

    if(isNaN(num)) return;

    if(num != lastCount || message.author.id == lastMsg.author.id) return require("../helpers/wrongCountPunish")(message, lastCount, num, message.author.id == lastMsg.author.id);

    let serverData;
    try {
        serverData = await serverModel.findOne({ serverId: message.guild.id });

        if(!serverData) {
            const server = await serverModel.create({
                serverId: message.guild.id
            });

            server.save();
        }

        serverData = await serverModel.findOne({ serverId: message.guild.id });
    } catch(err) {
        console.log(err);
    }

    await serverModel.findOneAndUpdate({
        serverId: message.guild.id
    }, {
        count: num
    });

    if(!serverData.members.find(m => m.userId == message.author.id)) await serverModel.findOneAndUpdate({ serverId: message.guild.id }, {
        $push: {
            members: {
                "userId": message.author.id,
                "count": {
                    "correct": 0,
                    "wrong": 0
                }
            }
        }
    });

    await serverModel.findOneAndUpdate({
        "serverId": message.guild.id,
        "members.userId": message.author.id
    }, {
        $inc: {
            "members.$.count.correct": 1
        }
    });
}