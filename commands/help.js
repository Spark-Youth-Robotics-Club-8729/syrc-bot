const Discord = require("discord.js")

module.exports = {
    name: 'help',
    description: "all commands of the bot",
    execute(client, message, args, Discord) {
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#5F75DE')
            .setTitle('Bot Commands')
            .addFields(
                { name: 'help', value: 'Gives a list of commands', inline: true },
                { name: 'ping', value: 'pong!', inline: true },
                { name: 'clear (value)', value: 'clears a certain amount of messages', inline: true },
                { name: 'kick (@username)', value: 'kicks mentioned user', inline: true },
                { name: 'ban (@username)', value: 'bans mentioned user', inline: true },
                { name: 'joke', value: 'sends a joke', inline: true },
            )
            .setImage('https://i.postimg.cc/dQjY2YNS/Screen-Shot-2022-03-07-at-9-00-41-PM.png')
        message.channel.send({ embeds: [newEmbed] });
    }
}