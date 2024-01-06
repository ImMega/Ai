require("dotenv").config();

const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const fs = require("fs");
const anilist = new (require("anilist-node"))();
const mongoose = require("mongoose");

const client = new Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildPresences, GatewayIntentBits.DirectMessages]
});

client.prefix = "$";
client.owner = "470277450551656459";

client.developing = false;
client.dbCmds = true;

module.exports = { client, anilist }

fs.readdirSync("./handlers/").filter(file => file.endsWith(".js")).forEach(handler => require(`./handlers/${handler}`)(client));

client.login(process.env.TOKEN);
mongoose.connect(process.env.MONGO)
.then(() => console.log("\x1b[32mConnected to database!\x1b[0m"))
.catch(err => console.log(`\x1b[31m${err}\x1b[0m`));

mongoose.connection.on("err", () => client.dbCmds = false);

require("./randomActivities")(client, ActivityType);