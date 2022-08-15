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
    client.channels.cache.get("1008762470724288623").send({ embeds: [newEmbed] });
}