const fs = require("fs");

module.exports = (message, err) => {
    const dateNow = new Date();

    const date = {
        year: dateNow.getUTCFullYear(),
        month: ((dateNow.getUTCMonth() + 1) < 10) ? "0" + (dateNow.getUTCMonth() + 1) : dateNow.getUTCMonth() + 1,
        day: (dateNow.getUTCDay() < 10) ? "0" + dateNow.getUTCDay() : dateNow.getUTCDay(),
        hours: (dateNow.getUTCHours() < 10) ? "0" + dateNow.getUTCHours() : dateNow.getUTCHours(),
        minutes: (dateNow.getUTCMinutes() < 10) ? "0" + dateNow.getUTCMinutes() : dateNow.getUTCMinutes(),
        seconds: (dateNow.getUTCSeconds() < 10) ? "0" + dateNow.getUTCSeconds() : dateNow.getUTCSeconds()
    }

    if(!fs.existsSync("./logs/")) fs.mkdirSync("./logs/");

    const writeStream = fs.createWriteStream(`./logs/${message.guild.id}-${date.year}${date.month}${date.day}-${date.hours}${date.minutes}${date.seconds}.txt`);

    const log = {
        server: message.guild.id,
        channel: message.channel,
        messageId: message.id ? message.id : null,
        error: err.toString()
    }

    writeStream.write(`Server: ${message.guild.name} (${message.guild.id})\nChannel: ${message.channel.name} (${message.channel.id})\nMessage ID: ${message.id ? message.id : null}\nUser: ${message.member.user.username} (${message.member.user.id})\nMessage Content: ${message.content ? message.content : null}\nError: ${err.toString()}`);
    writeStream.end();

    console.log(`\x1b[31mAn error has occured. Check log \x1b[37m${message.guild.id}-${date.year}${date.month}${date.day}-${date.hours}${date.minutes}${date.seconds}.txt\x1b[31m for more details.\x1b[0m`);
}