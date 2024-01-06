const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const name = "ship";
const desc = "Uhhh... Ship someone?";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "ship [mention or something]",
    slash: {
        name: name,
        description: desc,
        options: [
            {
                name: "name",
                type: ApplicationCommandOptionType.String,
                description: "The name of... uhhh whoever ig?"
            },
            {
                name: "name2",
                type: ApplicationCommandOptionType.String,
                description: "The name of other... uhh whoever ig?"
            }
        ]
    },

    async interactionInit(interaction) {
        await interaction.deferReply();

        const name = await this.getName(interaction, interaction.options.getString("name"));
        const name1 = await this.getName(interaction, interaction.options.getString("name2"));
        const username = interaction.user.username;
        const nickname = interaction.member.nickname;

        this.execute(interaction, name, name1, username, nickname, 1);
    },

    async msgInit(message, args) {
        const name = await this.getName(message, args[0]);
        const name1 = await this.getName(message, args[1]);
        const username = message.author.username;
        const nickname = message.member.nickname;

        this.execute(message, name, name1, username, nickname, 0);
    },

    async getName(message, input) {
        if(!input) return;
        if(!input.includes("<@") && !input.includes(">")) return input;

        const member = await message.guild.members.fetch(input.replace("<@", "").replace(">", ""));

        return member.nickname == null ? member.user.username : member.nickname;
    },

    async execute(message, name, name1, username, nickname, type) {
        if(!name){
            const members = await message.guild.members.fetch();
        
            const humans = members.filter((member) => { return member.user.bot != true && member.user.id != message.member.user.id }).map((member) => {
                return member.nickname == null ? member.user.username : member.nickname;
            });

            const name = nickname == null ? username : nickname;

            const random = Math.floor(Math.random() * humans.length);

            const match = Math.floor(Math.random() * 100);

            const bar = await this.progressBar(match);
            const text = await this.text(match);

            this.reply.send(message, type, {
                content: `💗 **MATCHMAKING** 💗\n🔻 _\`${name}\`_\n🔺 _\`${humans[random]}\`_`,
                embeds: [
                    new EmbedBuilder()
                    .setColor(0xFF69B4)
                    .setDescription("<:name:997088413687758888> **" + name.slice(0, (name.length/2).toFixed(0)) + humans[random].slice(((humans[random].length/2).toString().includes(".5") ? (humans[random].length/2).toFixed(0) - 1 : (humans[random].length/2).toFixed(0)))
                                    + `**\n**${match}%** ` + `${bar.join("")}` + ` ${text}`)
                ]
            });
        }
        else
        {
            if(name1)
            {
                const match = Math.floor(Math.random() * 100);

                const bar = await this.progressBar(match);
                const text = await this.text(match);
    
                this.reply.send(message, type, {
                    content: `💗 **MATCHMAKING** 💗\n🔻 _\`${name}\`_\n🔺 _\`${name1}\`_`,
                    embeds: [
                        new EmbedBuilder()
                        .setColor(0xFF69B4)
                        .setDescription("<:name:997088413687758888> **" + name.slice(0, (name.length/2).toFixed(0)) + name1.slice(((name1.length/2).toString().includes(".5") ? (name1.length/2).toFixed(0) - 1 : (name1.length/2).toFixed(0)))
                                        + `**\n**${match}%** ` + `${bar.join("")}` + ` ${text}`)
                    ]
                });
            }
            else
            {
                const name2 = nickname == null ? username : nickname;

                const match = Math.floor(Math.random() * 100);

                const bar = await this.progressBar(match);
                const text = await this.text(match);
    
                this.reply.send(message, type, {
                    content: `💗 **MATCHMAKING** 💗\n🔻 _\`${name2}\`_\n🔺 _\`${name}\`_`,
                    embeds: [
                        new EmbedBuilder()
                        .setColor(0xFF69B4)
                        .setDescription("<:name:997088413687758888> **" + name2.slice(0, (name.length/2).toFixed(0)) + name.slice(((name.length/2).toString().includes(".5") ? (name.length/2).toFixed(0) - 1 : (name.length/2).toFixed(0)))
                                        + `**\n**${match}%** ` + `${bar.join("")}` + ` ${text}`)
                    ]
                });
            }
        }
    },

    async progressBar(percent) {
        const bar = [];

        for(let i = 0; i < 10; i++){
            if(i == 0)
            {
                if(percent < 1) {bar.push("<:bar_start_empty:997085587125313556>"); continue;}
                if(percent <= 5 && percent > 0) {bar.push("<:bar_start_half:997085539457048586>"); continue;}
                if(percent > 5) {bar.push("<:bar_start_full:997085564371226705>"); continue;}
            }
            else if(i > 0 && i < 9)
            {
                if(percent <= (i * 10)) {bar.push("<:bar_empty:997086336613879838>"); continue;}
                if(percent < ((i + 1) * 10) && percent > (i * 10)) {bar.push("<:bar_half:997085504266838016>"); continue;}
                if(percent > ((i * 10) - 5)) {bar.push("<:bar_full:997085523678081135>"); continue;}
            }
            else if(i == 9)
            {
                if(percent <= 90) {bar.push("<:bar_end_empty:997086338144800768>"); continue;}
                if(percent < 100 && percent > 90) {bar.push("<:bar_end_empty:997086338144800768>"); continue;}
                if(percent == 100) {bar.push("<:bar_end_full:997085513498492988>"); continue;}
            }
        }

        return bar;
    },

    async text(percent) {
        let text;

        if(percent < 10) text = "Awful 😭";
        if(percent >= 10 && percent < 20) text = "Bad 😢";
        if(percent >= 20 && percent < 30) text = "Pretty Low 😦";
        if(percent >= 30 && percent < 40) text = "Not Too Great 😕";
        if(percent >= 40 && percent < 50) text = "Worse Than Average 😐";
        if(percent >= 50 && percent < 60) text = "Barely 😶";
        if(percent >= 60 && percent < 70 && percent != 69) text = "Not Bad 🙂";
        if(percent == 69) text = "( ͡° ͜ʖ ͡°)";
        if(percent >= 70 && percent < 80) text = "Pretty Good 😃";
        if(percent >= 80 && percent < 90) text = "Great 😄";
        if(percent >= 90 && percent < 100) text = "Amazing 😍";
        if(percent == 100) text = "PERFECT! ❣";
        
        return text;
    },

    reply: require("../../helpers/reply")
}