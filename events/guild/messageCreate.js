module.exports = async (Discord, client, message) => {
    if (message.content.startsWith("im ") || message.content.startsWith("Im ")) {
        await message.channel.send(`Hi ${message.content.substring(3)}, I'm dad!`);
    } else if (message.content.startsWith("i'm ") || message.content.startsWith("I'm ")) {
        await message.channel.send(`Hi ${message.content.substring(4)}, I'm dad!`);
    }
    const prefix = '!';
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.channel.id != 984570241193496646 && message.channel.id != 988138295869468743 && message.channel.id != 996812714473181315) return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);

    if (command) command.execute(client, message, args, Discord);
}