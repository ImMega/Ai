const { EmbedBuilder } = require("discord.js");
const { client } = require("../../index");

module.exports = {
    name: "reactiongameroleinitiate",
    aliases: [],
    description: "",
    usage: "",
    async msgInit(message) {
        if(message.author.id != client.ownerId && message.author.id != "421021542496075777") return;

        message.delete();
        
        const msg = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor(message.guild.members.me.displayHexColor)
                .setTitle("What games do you play?")
                .setDescription("<:csgo:1073625343526707320> - CS:GO\n\n<:apex:1073626827421130762> - Apex Legends\n\n<:genshin:1073626024916557964> - Genshin Impact\n\n<:leagueoflegends:1073627875485421619> - League of Legends\n\n<:minecraft:1073628023867314186> - Minecraft\n\n<:overwatch:1073626831942590555> - Overwatch\n\n<:valorant:1073628427204169808> - Valorant\n\n<:forhonor:1103048329052569640> - For Honor\n\n<:dyinglight:1103048604094050386> - Dying Light")
            ]
        });

        await msg.react("<:csgo:1073625343526707320>");
        await msg.react("<:apex:1073626827421130762>");
        await msg.react("<:genshin:1073626024916557964>");
        await msg.react("<:leagueoflegends:1073627875485421619>");
        await msg.react("<:minecraft:1073628023867314186>");
        await msg.react("<:overwatch:1073626831942590555>");
        await msg.react("<:valorant:1073628427204169808>");
        await msg.react("<:forhonor:1103048329052569640>");
        await msg.react("<:dyinglight:1103048604094050386>");
    }
}