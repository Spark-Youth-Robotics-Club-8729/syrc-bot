const Discord = require("discord.js")
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'roles',
    description: "reaction roles?????",
    execute(client, message, args, Discord) {
        console.log("hi")
        if (message.member.roles.cache.some(role => role.name === 'Lead')) {
            console.log("hi")
            let embed = new Discord.MessageEmbed()
                .setTitle('Reaction Roles')
                .setDescription('💀: Gives the lalalalal role \n\n <:tongtong:998701409220448257>Gives the randomrole role')
                .setColor('#5F75DE');

            message.channel.send({ embeds: [embed] }).then(embedMessage => {
                embedMessage.react("998701409220448257");
                embedMessage.react("💀");
                console.log("hi");
            });
        }
    }
}