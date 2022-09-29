const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const mysql = require(`mysql2`);
const Discord = require("discord.js");
const fs = require("fs");

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = {
    ...new SlashCommandBuilder()
        .setName("purge")
        .setDescription("clears a number of messages")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("amount of messages to clear")
                .setMaxValue(100)
                .setMinValue(1)
                .setRequired(true)
        ), run: async (client, interaction, args) => {
            let rawdata = fs.readFileSync('./config.json');
            let config = JSON.parse(rawdata);
            let modroles = [];
            for (i in config.modrole) {
                modroles.push(config.modrole[i].role_id);
            }
            if (interaction.member.roles.cache.some(role => modroles.includes(role.id))) {
                const num = interaction.options.getInteger("clear");
                await interaction.channel.messages.fetch({ limit: args[0] }).then(async messages => {
                    interaction.channel.bulkDelete(messages);
                    if (args[0] > 1) {
                        await interaction.reply(String(args[0]) + " messages cleared");
                        await sleep(3000);
                        await interaction.deleteReply();
                    } else {
                        await interaction.reply("1 message cleared")
                        await sleep(3000);
                        await interaction.deleteReply();
                    }
                });
            }
        }
}
