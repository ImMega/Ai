const fs = require("fs");

const name = "fireforce";
const desc = "Fire goes brrrr";

module.exports = {
    name: name,
    aliases: ["inferno"],
    description: desc,
    usage: "fireforce",
    slash: {
        name: name,
        description: desc
    },

    async interactionInit(interaction) {
        await interaction.deferReply();

        this.execute(interaction, 1)
    },

    async msgInit(message) {
        this.execute(message, 0);
    },

    execute(message, type){
        const vids = fs.readdirSync("./assets/videos/").filter(file => file.endsWith(".mp4"));

        const random = Math.floor(Math.random() * vids.length);

        this.reply.send(message, type, { files: [`./assets/videos/${vids[random]}`] });
    },

    reply: require("../../helpers/reply")
}