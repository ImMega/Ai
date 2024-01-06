const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const serverModel = require("../../models/serverSchema");

const name = "counts";
const desc = "Shows counting leaderboard for this server";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "counts",
    async msgInit(message) {
        this.execute(message, 0);
    },

    async interactionInit(interaction) {
        await interaction.deferReply();

        this.execute(interaction, 1);
    },

    async execute(message, type) {
        const { client } = require("../../index");

        if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled." });

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
            require("../../helpers/errorLogging")(message, err);

            return this.reply.reply(message, type, { content: "Sorry, some error occured so I was unable to fetch your counting leaderboard..." });
        }

        const row = (page, members, sort) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("up").setStyle("Primary").setEmoji("⬆️").setDisabled(!(page>0)),
                new ButtonBuilder().setCustomId("sort").setStyle("Primary").setEmoji("📶").setDisabled(!sort),
                new ButtonBuilder().setCustomId("down").setStyle("Primary").setEmoji("⬇️").setDisabled(!(((page+1)*10) < members))
            );
        }

        const membersData = serverData.members;

        let sortedData = membersData.slice(0, 10).sort((r1, r2) => (r1.count.correct < r2.count.correct) ? 1 : (r1.count.correct > r2.count.correct) ? -1 : 0);

        const msg = await this.reply.reply(message, type, {
            embeds: [
                new EmbedBuilder()
                .setColor(message.guild.members.me.displayHexColor)
                .setTitle("Counting Leaderboard")
                .setThumbnail(message.guild.iconURL())
                .setDescription("**Sorted by:** Correct Counts\n\n"
                + sortedData.map((m, i) => `**#${i + 1}** - <@${m.userId}> - ***${m.count.correct} counts***`).join("\n"))
            ],
            components: [row(0, membersData.length, true)]
        });

        const filter = i => (i.customId == "sort" || i.customId == "up" || i.customId == "down") && i.user.id == message.member.user.id;

        const collector = await msg.createMessageComponentCollector({ filter, time: 60000 });

        let page = 0;
        let sort = 0;

        collector.on("collect", async i => {
            if(i.customId == "sort") {
                switch (sort) {
                    case 0:
                        sort = 1;
                        sortedData = membersData.sort((r1, r2) => (r1.count.wrong < r2.count.wrong) ? 1 : (r1.count.wrong > r2.count.wrong) ? -1 : 0).slice(10*page, 10*(page+1));
                        break;
                    case 1:
                        sort = 2;
                        sortedData = membersData.sort((r1, r2) => ((r1.count.correct / (r1.count.correct + r1.count.wrong)) < (r2.count.correct / (r2.count.correct + r2.count.wrong))) ? 1 : ((r1.count.correct / (r1.count.correct + r1.count.wrong)) > (r2.count.correct / (r2.count.correct + r2.count.wrong))) ? -1 : 0).slice(10*page, 10*(page+1));
                        break;
                    case 2:
                        sort = 0;
                        sortedData = membersData.sort((r1, r2) => (r1.count.correct < r2.count.correct) ? 1 : (r1.count.correct > r2.count.correct) ? -1 : 0).slice(10*page, 10*(page+1));
                        break;
                }

                await i.update({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(message.guild.members.me.displayHexColor)
                        .setTitle("Counting Leaderboard")
                        .setThumbnail(message.guild.iconURL())
                        .setDescription(`**Sorted by:** ${sort ? sort == 1 ? "Wrong Counts" : "Correct Rate" : "Correct Counts"}\n\n`
                        + sortedData.map((m, i) => `**#${page*10 + (i + 1)}** - <@${m.userId}> - ***${sort ? sort == 1 ? `${m.count.wrong} counts` : (m.count.correct + m.count.wrong) == 0 ? "nothing" : `${((m.count.correct / (m.count.correct + m.count.wrong)) * 100).toFixed(0)}% correct` : `${m.count.correct} counts`}***`).join("\n"))
                    ],
                    components: [row(page, membersData.length, true)]
                });
            }
            else if(i.customId == "down") {
                page++;

                switch (sort) {
                    case 0:
                        sortedData = membersData.sort((r1, r2) => (r1.count.correct < r2.count.correct) ? 1 : (r1.count.correct > r2.count.correct) ? -1 : 0).slice(10*page, 10*(page+1));
                        break;
                    case 1:
                        sortedData = membersData.sort((r1, r2) => (r1.count.wrong < r2.count.wrong) ? 1 : (r1.count.wrong > r2.count.wrong) ? -1 : 0).slice(10*page, 10*(page+1));
                        break;
                    case 2:
                        sortedData = membersData.sort((r1, r2) => ((r1.count.correct / (r1.count.correct + r1.count.wrong)) < (r2.count.correct / (r2.count.correct + r2.count.wrong))) ? 1 : ((r1.count.correct / (r1.count.correct + r1.count.wrong)) > (r2.count.correct / (r2.count.correct + r2.count.wrong))) ? -1 : 0).slice(10*page, 10*(page+1));
                        break;
                }

                await i.update({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(message.guild.members.me.displayHexColor)
                        .setTitle("Counting Leaderboard")
                        .setThumbnail(message.guild.iconURL())
                        .setDescription(`**Sorted by:** ${sort ? sort == 1 ? "Wrong Counts" : "Correct Rate" : "Correct Counts"}\n\n`
                        + sortedData.map((m, i) => `**#${page*10 + (i + 1)}** - <@${m.userId}> - ***${sort ? sort == 1 ? `${m.count.wrong} counts` : (m.count.correct + m.count.wrong) == 0 ? "nothing" : `${((m.count.correct / (m.count.correct + m.count.wrong)) * 100).toFixed(0)}% correct` : `${m.count.correct} counts`}***`).join("\n"))
                    ],
                    components: [row(page, membersData.length, true)]
                });
            }
            else if(i.customId == "up") {
                page--;

                switch (sort) {
                    case 0:
                        sortedData = membersData.sort((r1, r2) => (r1.count.correct < r2.count.correct) ? 1 : (r1.count.correct > r2.count.correct) ? -1 : 0).slice(10*page, 10*(page+1));
                        break;
                    case 1:
                        sortedData = membersData.sort((r1, r2) => (r1.count.wrong < r2.count.wrong) ? 1 : (r1.count.wrong > r2.count.wrong) ? -1 : 0).slice(10*page, 10*(page+1));
                        break;
                    case 2:
                        sortedData = membersData.sort((r1, r2) => ((r1.count.correct / (r1.count.correct + r1.count.wrong)) < (r2.count.correct / (r2.count.correct + r2.count.wrong))) ? 1 : ((r1.count.correct / (r1.count.correct + r1.count.wrong)) > (r2.count.correct / (r2.count.correct + r2.count.wrong))) ? -1 : 0).slice(10*page, 10*(page+1));
                        break;
                }

                await i.update({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(message.guild.members.me.displayHexColor)
                        .setTitle("Counting Leaderboard")
                        .setThumbnail(message.guild.iconURL())
                        .setDescription(`**Sorted by:** ${sort ? sort == 1 ? "Wrong Counts" : "Correct Rate" : "Correct Counts"}\n\n`
                        + sortedData.map((m, i) => `**#${page*10 + (i + 1)}** - <@${m.userId}> - ***${sort ? sort == 1 ? `${m.count.wrong} counts` : (m.count.correct + m.count.wrong) == 0 ? "nothing" : `${((m.count.correct / (m.count.correct + m.count.wrong)) * 100).toFixed(0)}% correct` : `${m.count.correct} counts`}***`).join("\n"))
                    ],
                    components: [row(page, membersData.length, true)]
                });
            }
        });

        collector.on("end", collected => {
            msg.edit({
                components: [row(false)]
            });
        });
    },

    reply: require("../../helpers/reply")
}