const ms = require('ms');
const Discord = require("discord.js");

module.exports = {
    name: 'test',
    description: "unmute a member",
    async execute(client, message, args, Discord) {
        if (message.member.id === "706326876209283113") {
            message.channel.send("ok");
        }
    }
}