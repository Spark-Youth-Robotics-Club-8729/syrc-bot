const ms = require('ms');
const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    name: 'test',
    description: "unmute a member",
    async execute(client, message, args, Discord) {
        message.channel.send("hi");
    }
}
