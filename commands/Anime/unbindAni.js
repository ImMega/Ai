const profileModel = require("../../models/profileSchema");

const name = "alunbind";
const desc = "Unbinds your AniList profile";

module.exports = {
    name: name,
    aliases: [],
    description: desc,
    usage: "alunbind",
    async interactionInit(interaction) {
        await interaction.deferReply();

        const id = interaction.user.id;

        this.execute(interaction, id, 1)
    },

    async msgInit(message, args) {
        const id = message.author.id;

        this.execute(message, id, 0);
    },

    async execute(message, id, type) {
        const { client } = require("../../index");

        if(!client.dbCmds) return this.reply.reply(message, type, { content: "Sorry, we have problems with the database so all functionality related to database is temporarily disabled.\nTho you can still search for MAL users, so that's something!" });

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
            if(profileData.al == "") return this.reply.reply(message, type, { content: "You are not binded to any profile!" });
    
            await profileModel.findOneAndUpdate({ userId: id }, { al: "" });
    
            this.reply.reply(message, type, { content: `You have now successfully unbinded your AniList profile!` });
        } catch(err) {
            require("../../helpers/errorLogging")(message, err);
            
            return this.reply.reply(message, type, { content: "Sorry, some error occured so I was unable to unbind your AniList..." });
        }
    },

    reply: require("../../helpers/reply")
}