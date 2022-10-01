const fs = require("fs");
const { pgClient } = require("../../main");
var Filter = require('bad-words');

module.exports = (Discord, client, message) => {
    let filter = new Filter();
    let rawData = fs.readFileSync('./config.json');
    let config = JSON.parse(rawData);
    let censor = [];
    let uncensor = [];
    for (i in config.censor) {
        censor.push(config.censor[i].word);
    }
    for (i in config.uncensor) {
        uncensor.push(config.uncensor[i].word);
    }
    filter.addWords(...censor);
    filter.removeWords(...uncensor);
    if (message.author.bot || filter.isProfane(message.content.toLowerCase())) {
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
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() });
    if (message.channel.id == config.countingchannel[0].channel_id) { // this needs to be fetched from config.json later
        pgClient.query(`SELECT * FROM counting`, async (err, res) => {
            if (message.content.startsWith(parseInt(res.rows[0].number))) { // might not work idk if the [0] should be there :clown:
                pgClient.query(`UPDATE counting SET number = ('${parseInt(res.rows[0].number)-1}'), user_id = ('${res.rows[0].number}')`);
            }
        })
    }
    client.channels.cache.get(config.logchannel[0].channel_id).send({ embeds: [newEmbed] });
}
