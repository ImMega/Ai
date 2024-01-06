const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "mal",
    aliases: [],
    slash: {
        name: "mal",
        description: "mal",
        options: [
            {
                name: "profile",
                type: ApplicationCommandOptionType.SubcommandGroup,
                description: "mal profile",
                options: [
                    {
                        name: "view",
                        type: ApplicationCommandOptionType.Subcommand,
                        description: require("../Anime/malProfile").description,
                        options: [
                            {
                                name: "username",
                                type: ApplicationCommandOptionType.String,
                                description: "The username of the MAL profile"
                            },
                            {
                                name: "user",
                                type: ApplicationCommandOptionType.User,
                                description: "The Discord user"
                            }
                        ]
                    },
                    {
                        name: "bind",
                        type: ApplicationCommandOptionType.Subcommand,
                        description: require("../Anime/bindMal").description,
                        options: [
                            {
                                name: "username",
                                type: ApplicationCommandOptionType.String,
                                description: "Your MAL username",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "unbind",
                        type: ApplicationCommandOptionType.Subcommand,
                        description: require("../Anime/unbindMal").description
                    }
                ]
            }
        ]
    },

    async msgInit() {
        return;
    },

    async interactionInit(interaction) {
        switch (interaction.options.getSubcommand()) {
            case "view":
                require("../Anime/malProfile").interactionInit(interaction);
                break;
            case "bind":
                require("../Anime/bindMal").interactionInit(interaction);
                break;
            case "unbind":
                require("../Anime/unbindMal").interactionInit(interaction);
                break;
        }
    }
}