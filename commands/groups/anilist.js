const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "anilist",
    aliases: [],
    slash: {
        name: "anilist",
        description: "anilist",
        options: [
            {
                name: "profile",
                type: ApplicationCommandOptionType.SubcommandGroup,
                description: "anilist profile",
                options: [
                    {
                        name: "view",
                        type: ApplicationCommandOptionType.Subcommand,
                        description: require("../Anime/alProfile").description,
                        options: [
                            {
                                name: "username",
                                type: ApplicationCommandOptionType.String,
                                description: "The username of the AniList profile"
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
                        description: require("../Anime/bindAni").description,
                        options: [
                            {
                                name: "username",
                                type: ApplicationCommandOptionType.String,
                                description: "Your AniList username",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "unbind",
                        type: ApplicationCommandOptionType.Subcommand,
                        description: require("../Anime/unbindAni").description
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
                require("../Anime/alProfile").interactionInit(interaction);
                break;
            case "bind":
                require("../Anime/bindAni").interactionInit(interaction);
                break;
            case "unbind":
                require("../Anime/unbindAni").interactionInit(interaction);
        }
    }
}