const { Collection } = require("discord.js"); 
const fs = require("fs");

let initTimestamp;
let doneTimestamp;

module.exports = (client) => {
    client.commands = new Collection();
    client.cmdaliases = new Collection();

    const filesLoad = (folderPathArray, folderName, isMain, loadedFolders) => {
        const folderPath = folderPathArray.join("");

        const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));

        for (const file of files) {
            if(!fs.existsSync(folderPath + file)) continue;

            const cmd = require("." + folderPath + file);

            client.commands.set(cmd.name, cmd);
            cmd.aliases.forEach(alias => {
                client.cmdaliases.set(alias, cmd.name);
            });

            if(folderName !== "private" && folderName !== "groups") client.categories.find(cat => cat.name == folderName).cmds.push(cmd.name);

            console.log(`${file} has been loaded successfully!`);
        }

        if(files.length == 0) client.categories.pop();

        if (!isMain || loadedFolders.includes(folderName)) folderPathArray.pop();

        loadedFolders.push(folderName);

        folderSearch(folderPathArray, loadedFolders, isMain);
    }

    const folderSearch = (folderPathArray, loadedFolders, isMain) => {
        const folderPath = folderPathArray.join("");

        const files = fs.readdirSync(folderPath);

        for (const file of files) {
            if(loadedFolders.includes(file)) return;

            if(!fs.existsSync(folderPath + file)) continue;

            const fileStats = fs.statSync(folderPath + file);

            if(!fileStats.isDirectory()) continue;

            folderPathArray.push(file + "/");
            if(file !== "private" && file !== "groups") client.categories.push({ name: file, cmds: [] });

            filesLoad(folderPathArray, file, false, loadedFolders);
        }

        if(isMain) doneTimestamp = Date.now();

        if(isMain) console.log(`\x1b[32mCommand files loaded in ${((doneTimestamp - initTimestamp)/1000).toFixed(1)}s (${doneTimestamp - initTimestamp}ms).\x1b[0m`);
    }

    client.categories = [
        {
            name: "Commands",
            cmds: []
        }
    ];

    initTimestamp = Date.now();

    filesLoad(["./commands/"], "Commands", true, []);
}