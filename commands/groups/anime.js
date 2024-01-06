const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "anime",
    aliases: [],
    slash: {
        name: "anime",
        description: "anime",
        options: [
            {
                name: "search",
                type: ApplicationCommandOptionType.Subcommand,
                description: require("../Anime/anime").description,
                options: [
                    {
                        name: "title",
                        type: ApplicationCommandOptionType.String,
                        description: "Title of an anime",
                        required: true
                    }
                ]
            },
            {
                name: "character",
                type: ApplicationCommandOptionType.Subcommand,
                description: require("../Anime/character").description,
                options: [
                    {
                        name: "name",
                        type: ApplicationCommandOptionType.String,
                        description: "Name of the character",
                        required: true
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
            case "search":
                require("../Anime/anime").interactionInit(interaction);
                break;
            case "character":
                require("../Anime/character").interactionInit(interaction);
                break;
        }
    }
}