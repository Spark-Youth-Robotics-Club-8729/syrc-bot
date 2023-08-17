const fs = require('fs')

module.exports = async (client, _Discord) => {
    const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
    for (const file of command_files) {
        const command = require(`../commands/${file}`);
        if (command.name) {
            client.commands.set(command.name, command)
        } else {
            continue;
        }
    }

    // slash commands
    const arrayOfSlashCommands = [];
    const slashCommands = fs.readdirSync('./slash_commands/').filter(file => file.endsWith('.js'))
    for (const file of slashCommands) {
        const command = require(`../slash_commands/${file}`);
        if (command.name) {
            client.slashCommands.set(command.name, command)
            arrayOfSlashCommands.push(command);
        } else {
            continue;
        }
    }
    client.on("ready", async () => {
        await client.application.commands.set(arrayOfSlashCommands);
    });
}
