const ms = require('ms');
const Discord = require("discord.js");

module.exports = {
    name: 'test',
    description: "unmute a member",
    async execute(client, message, args, Discord) {
        if (message.member.id === "706326876209283113") {
            var roleid = ("997528669247516682");
            const newEmbed = new Discord.MessageEmbed()
                .setColor("#5F75DE")
                .setDescription(`<@&${roleid}> meeting NOW`)
            message.channel.send({ embeds: [newEmbed] });
            message.channel.send(`<@&${roleid}>`);
            console.log(`<@&${roleid}>`)
        }
    }
}