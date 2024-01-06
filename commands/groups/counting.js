const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "counting",
    aliases: [],
    slash: {
        name: "counting",
        description: "Counting",
        options: [
            {
                name: "addchannel",
                type: ApplicationCommandOptionType.Subcommand,
                description: require("../Admins Only/countChannel").description,
                options: [
                    {
                        name: "channel",
                        type: ApplicationCommandOptionType.Channel,
                        description: "Channel to set as the counting channel",
                        required: true
                    }
                ]
            },
            {
                name: "removechannel",
                type: ApplicationCommandOptionType.Subcommand,
                description: require("../Admins Only/removeCountChannel").description
            },
            {
                name: "check",
                type: ApplicationCommandOptionType.Subcommand,
                description: require("../Counting/countCheck").description,
                options: [
                    {
                        name: "user",
                        type: ApplicationCommandOptionType.User,
                        description: "A Discord user"
                    }
                ]
            },
            {
                name: "leaderboard",
                type: ApplicationCommandOptionType.Subcommand,
                description: require("../Counting/countLeaderboard").description
            }
        ]
    },

    async msgInit() {
        return;
    },

    async interactionInit(interaction) {
        switch (interaction.options.getSubcommand()) {
            case "addchannel":
                require("../Admins Only/countChannel").interactionInit(interaction);
                break;
            case "removechannel":
                require("../Admins Only/removeCountChannel").interactionInit(interaction);
                break;
            case "check":
                require("../Counting/countCheck").interactionInit(interaction);
                break;
            case "leaderboard":
                require("../Counting/countLeaderboard").interactionInit(interaction);
                break;
        }
    }
}