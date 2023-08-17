module.exports = {
    name: 'mute',
    description: "Mute a member",
    async execute(client, message, args, Discord) {
        const target = message.mentions.users.first();

        if (target) {
            const memberTarget = message.guild.members.cache.get(target.id);
            let reason = args.slice(1).join(" ");
            if (!reason) reason = "No reason given";
            if (memberTarget.kickable) {
                const kickEmbed = new Discord.MessageEmbed()
                    .setTitle(`You were muted in ${message.guild.name}`)
                    .setDescription(`Reason: ${reason}`)
                    .setColor("#5F75DE")
                    .setTimestamp()
                    .setFooter(client.user.tag, client.user.displayAvatarURL());
                try {
                    await memberTarget.send({ embeds: [kickEmbed] });
                } catch (err) {
                    console.log(`I was unable to message the member.`);
                }
                let mainRole = message.guild.roles.cache.find(role => role.name === 'member')
                let muteRole = message.guild.roles.cache.find(role => role.name === 'mute')

                memberTarget.roles.remove(mainRole.id);
                memberTarget.roles.add(muteRole.id);
                message.channel.send(`<@${memberTarget.user.id}> has been muted`);
            } else {
                message.channel.send('Cant find member')
            }
        }
    }
}
