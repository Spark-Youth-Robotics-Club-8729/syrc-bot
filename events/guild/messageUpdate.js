module.exports = async (Discord, client, oldMessage, newMessage) => {
    console.log("hi")
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
                name: 'Message author: ', value: `${oldMessage.author}`
            },
            {
                name: 'Edited in: ', value: `${oldMessage.channel}`
            },
            {
                name: 'Before: ', value: `${oldMessage}`
            },
            {
                name: 'After: ', value: `${newMessage}`
            },
        )
        .setColor("#ff0000")
        .setTimestamp()
        .setFooter(client.user.tag, client.user.displayAvatarURL());
    client.channels.cache.get("1008762470724288623").send({ embeds: [newEmbed] });
}