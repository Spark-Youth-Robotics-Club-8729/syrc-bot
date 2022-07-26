const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const mysql = require(`mysql2`);
const Discord = require("discord.js")

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = {
    ...new SlashCommandBuilder()
        .setName("clear")
        .setDescription("clears a number of messages")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("amount of messages to clear")
                .setMaxValue(100)
                .setMinValue(1)
                .setRequired(true)
        ), run: async (client, interaction, args) => {
            if (interaction.member.roles.cache.some(role => role.name === 'Lead')) {
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
