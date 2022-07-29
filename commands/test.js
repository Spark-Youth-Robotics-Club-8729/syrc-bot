const ms = require('ms');
const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    name: 'test',
    description: "unmute a member",
    async execute(client, message, args, Discord) {
        let msgSplit = message.content.split(' ');
        console.log(msgSplit[1]);
        console.log(msgSplit[2]);
        role=message.guild.roles.cache.find(role => role.id === msgSplit[2])
        console.log(role.name);
    }
}
