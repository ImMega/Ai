module.exports = (client, ActivityType) => {
    const a = [
        {
            type: ActivityType.Watching,
            name: ["anime", "Kimi No Na Wa.", "more anime", "even more anime"]
        },
        {
            type: ActivityType.Playing,
            name: ["DDLC", "Scarlet Nexus", "osu!"]
        },
        {
            type: ActivityType.Listening,
            name: ["Ikiru Yosuga", "Bassline Yateru?"]
        }
    ];

    setInterval(() => {
        const rngType = Math.floor(Math.random() * a.length);
        const rngName = Math.floor(Math.random() * a[rngType].name.length);

        try {
            client.user.setActivity(a[rngType].name[rngName], { type: a[rngType].type });
        } catch(err) {
            console.log("\x1b[31mERR:\x1b[0m Couldn't set a random activity.")
        }
    }, 7000);
}