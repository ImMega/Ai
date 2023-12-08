module.exports = async (client) => {
    console.log(`\x1b[32m${client.user.username} is now online!\x1b[0m`);

    const guild = await client.guilds.fetch("1029786735787393075");
    const channel = await guild.channels.fetch("1073653419480449154");
    await channel.messages.fetch("1073659815383011359");
}