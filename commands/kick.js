const { MessageSelectMenu, DiscordAPIError } = require("discord.js");
const { execute } = require("./ping");
const Discord = require("discord.js");

module.exports = {
    name: 'kick',
    description: "kick people",
    async execute(client, message, args) {
        if (message.member.roles.cache.some(role => role.name === 'Lead')) {
            const member = message.mentions.users.first();
            if (member) {
                const memberTarget = message.guild.members.cache.get(member.id);
                let reason = args.slice(1).join(" ");
                if (!reason) reason = "No reason given";
                if (memberTarget.kickable) {
                    const kickEmbed = new Discord.MessageEmbed()
                        .setTitle(`You were kicked from ${message.guild.name}`)
                        .setDescription(`Reason: ${reason}`)
                        .setColor("#5F75DE")
                        .setTimestamp()
                        .setFooter(client.user.tag, client.user.displayAvatarURL());
                    try {
                        await memberTarget.send({ embeds: [kickEmbed] });
                    } catch (err) {
                        message.channel.send(`I was unable to message the member.`);
                    }
                    memberTarget.kick();
                    message.channel.send("User has been kicked");
                } else {
                    message.channel.send("Insufficient Permissions");
                }
            } else {
                message.channel.send('No member specified');
            }
        } else {
            message.channel.send("Lol you don't have perms to kick people");
        }
    }
}
