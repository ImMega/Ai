const jikan = require("@mateoaranda/jikanjs");
const profileModel = require("../../models/profileSchema");

const name = "malbind";
const desc = "Binds your MAL profile. Useful so you don't have to type it every time you want to check it";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "malbind <MAL username>",
    async interactionInit(interaction) {
        await interaction.deferReply();

        const id = interaction.user.id;
        const query = interaction.options.getString("username");

        this.execute(interaction, id, query, 1)
    },

    async msgInit(message, args) {
        const id = message.author.id;
        const query = args.join(" ");

        this.execute(message, id, query, 0);
    },

    async execute(message, id, query, type) {
        const { client } = require("../../index");

        if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled.\nTho you can still search for MAL users, so that's something!" });

        if(!query) return this.reply.reply(message, type, { content: "You need to enter your MAL username!" });

        let profileData;
        try {
            profileData = await profileModel.findOne({ userId: id });
    
            if(!profileData) {
                const profile = await profileModel.create({
                    userId: id
                });
    
                profile.save();
            }

            profileData = await profileModel.findOne({ userId: id });
        } catch(err) {
            console.log(err);
        }

        try {
            const malUser = await jikan.loadUser(query);

            if(profileData.mal == malUser.data.username) return this.reply.reply(message, type, { content: "You are already binded to that profile!" });
    
            await profileModel.findOneAndUpdate({ userId: id }, { mal: malUser.data.username });
    
            this.reply.reply(message, type, { content: `You're now successfully binded to your MAL profile **${malUser.data.username}**!` });
        } catch(err) {
            require("../../helpers/errorLogging")(message, err);
            
            if(err.toString().includes("404")) {
                return this.reply.reply(message, type, { content: "Sorry, couldn't find anything..." });
            } else if(err.toString().includes("Idle timeout reached")) {
                return this.reply.reply(message, type, { content: "Sorry, MAL kinda didn't respond on time. You can try again if you want" });
            } else {
                return this.reply.reply(message, type, { content: "Sorry, some error occured so I was unable to fetch your MAL..." });
            }
        }
    },

    reply: require("../../helpers/reply")
}