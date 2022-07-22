const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const mysql = require(`mysql2`);
const Discord = require("discord.js")

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
            const num = interaction.options.getInteger("clear");
            await interaction.channel.messages.fetch({ limit: args[0] }).then(messages => {
                interaction.channel.bulkDelete(messages);
                if (args[0] > 1) {
                    interaction.reply(String(args[0]) + " messages cleared.");
                } else {
                    interaction.reply("1 message cleared.")
                }
            });
        }
}