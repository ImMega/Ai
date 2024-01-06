const profileModel = require("../../models/profileSchema");

const name = "albind";
const desc = "Binds your AniList profile. Useful so you don't have to type it every time you want to check it";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "albind <AniList username>",
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
        const { client, anilist } = require("../../index");

        if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled.\nTho you can still search for AniList users, so that's something!" });
        
        if(!query) return this.reply.reply(message, type, { content: "You need to enter your AniList username!" });

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
            const userSearch = await anilist.searchEntry.user(query, 1, 1);
            if(userSearch.users.length < 1) return this.reply.reply(message, type, { content: "Sorry, I couldn't find anything..." });
    
            const user = await anilist.user.profile(userSearch.users[0].id);

            if(profileData.al == user.name) return this.reply.reply(message, type, { content: "You are already binded to that profile!" });
    
            await profileModel.findOneAndUpdate({ userId: id }, { al: user.name });

            this.reply.reply(message, type, { content: `You're now successfully binded to your AniList profile **${user.name}**!` });
        } catch(err) {
            require("../../helpers/errorLogging")(message, err);

            return this.reply.reply(message, type, { content: "Sorry, some error occured so I was unable to fetch your AniList..." });
        }
    },

    reply: require("../../helpers/reply")
}