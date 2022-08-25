const { pgClient } = require("../../main");


module.exports = (Discord, client, message) => {
    if (message.author.bot) {
        return;
    }
    const newEmbed = new Discord.MessageEmbed()
        .setTitle(`Message deleted`)
        .addFields(
            { name: 'Message content:', value: `||${message.content}||`, inline: true },
            {
                name: 'Message author: ', value: `${message.author}`, inline: true
            },
            {
                name: 'Deleted in: ', value: `${message.channel}`, inline: true
            },
        )
        .setColor("#ff0000")
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL());
    client.channels.cache.get("988138295869468743").send({ embeds: [newEmbed] });
    if (message.channel.id == config.countingchannel[0].channel_id) { // this needs to be fetched from config.json later
        pgClient.query(`SELECT * FROM counting`, async (err, res) => {

            if (message.content.startsWith(parseInt(res.rows[0].number))) { // might not work idk if the [0] should be there :clown:
                message.chanel.send(`${res.rows[0].number + 1}`);
                pgClient.query(`UPDATE counting SET user_id = ('${message.author.id}')`);
            } else {
                await message.delete();
            }
        })
    }
}
