const fs = require("fs");

let initTimestamp;
let doneTimestamp;

module.exports = (client) => {
    const loadDir = (dir) => {
        const files = fs.readdirSync(`./events/${dir}/`).filter(file => file.endsWith(".js"));

        for (const file of files) {
            const eventName = file.split(".")[0];
            const event = require(`../events/${dir}/${file}`);
            client.on(eventName, event.bind(null, client));
        }

        if(files.length != 0) console.log(`Event ${dir} files successfully loaded!`);
    }

    initTimestamp = Date.now();

    ["client", "message", "guild"].forEach(event => loadDir(event));

    doneTimestamp = Date.now();

    console.log(`\x1b[32mEvent files loaded in ${((doneTimestamp - initTimestamp)/1000).toFixed(1)}s (${doneTimestamp - initTimestamp}ms).\x1b[0m`);
}