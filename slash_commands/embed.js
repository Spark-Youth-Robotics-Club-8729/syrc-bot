const { execute } = require("../commands/ping");
const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
module.exports = {
    // channel, title, description - colour, footer, image url
    ...new SlashCommandBuilder()
        .setName('embed')
        .setDescription('creates an embed using the bot')
        .addStringOption((option) =>
            option
                .setName("text")
                .setDescription("message that you want to echo")
                .setRequired(true)
        ),
    run: async (client, interaction, args) => {
        const msg = interaction.options.getString("text");
        interaction.followUp({ content: msg });
    },
};