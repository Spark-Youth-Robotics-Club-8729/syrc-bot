const fs = require("fs");

module.exports = async (Discord, client, oldMessage, newMessage) => {
    if (oldMessage.author.bot) {
        return;
    }
    if (oldMessage.toString().includes("https://")) {
        return;
    }
    const newEmbed = new Discord.MessageEmbed()
        .setTitle(`Message edited`)
        .addFields(
            {
                name: 'Before: ', value: `\`\`\`${oldMessage}\`\`\``, inline: true
            },
            {
                name: 'After: ', value: `\`\`\`${newMessage}\`\`\``, inline: true
            },
            {
                name: '\u200b', value: '\u200b', inline: true
            },
            {
                name: 'Edited in: ', value: `${oldMessage.channel}`, inline: true
            },
            {
                name: 'Link to message: ', value: `${newMessage.url}`, inline: true
            },
            {
                name: 'Message author: ', value: `${oldMessage.author}`, inline: true
            },
        )
        .setColor("#ff0000")
        .setTimestamp()
        .setAuthor({ name: oldMessage.author.username, iconURL: oldMessage.author.displayAvatarURL() });
    let rawData = fs.readFileSync('./config.json');
    let config = JSON.parse(rawData);
    client.channels.cache.get(config.logchannel[0].channel_id).send({ embeds: [newEmbed] });
}
