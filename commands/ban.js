const { MessageSelectMenu } = require("discord.js");
const { execute } = require("./ping");
const Discord = require("discord.js");

module.exports = {
    name: 'ban',
    description: "ban people",
    async execute(client, message, args) {
        // if (message.member.roles.cache.some(role => role.name === 'god')) {
        const member = message.mentions.users.first();
        if (member) {
            const memberTarget = message.guild.members.cache.get(member.id);
            let reason = args.slice(1).join(" ");
            if (!reason) reason = "No reason given";
            if (memberTarget.kickable) {
                const banEmbed = new Discord.MessageEmbed()
                    .setTitle(`You were banned from ${message.guild.name}`)
                    .setDescription(`Reason: ${reason}`)
                    .setColor("#5F75DE")
                    .setTimestamp()
                    .setFooter(client.user.tag, client.user.displayAvatarURL());
                try {
                    await memberTarget.send({ embeds: [banEmbed] });
                } catch (err) {
                    message.channel.send(`I was unable to message the member.`);
                }
                memberTarget.ban();
                message.channel.send("User has been banned");
            } else {
                message.channel.send("Insufficient Permissions");
            }
        } else {
            message.channel.send('You couldnt ban that member');
        }
    }
}