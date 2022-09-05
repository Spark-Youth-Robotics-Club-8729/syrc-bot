const ms = require('ms');
const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    name: 'test',
    description: "test smth",
    async execute(client, message, args, Discord) {
        console.log(message.content.split(' ')[1]);
        let role = await message.guild.roles.cache.find(r => r.id == message.content.split(' ')[1]);
        console.log(role);
        await message.channel.send({ content: `role name: ${role.name}` });
    }
}
