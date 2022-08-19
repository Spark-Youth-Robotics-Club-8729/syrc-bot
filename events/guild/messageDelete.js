const fs = require("fs");

module.exports = (Discord, client, message) => {
    if (message.author.bot) {
        return;
    }
    const newEmbed = new Discord.MessageEmbed()
        .setTitle(`Message deleted`)
        .addFields(
            {
                name: 'Message content:', value: `\`\`\`${message.content}\`\`\``, inline: true
            },
            {
                name: 'Deleted in: ', value: `${message.channel}`, inline: true
            },
            {
                name: 'Message author: ', value: `${message.author}`, inline: true
            },
        )
        .setColor("#ff0000")
        .setTimestamp()
        .setFooter(message.author.username, message.author.displayAvatarURL());
    let rawData = fs.readFileSync('./config.json');
    let config = JSON.parse(rawData);
    client.channels.cache.get(config.logchannel[0].channel_id).send({ embeds: [newEmbed] });
}