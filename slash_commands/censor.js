const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const Discord = require("discord.js");
const config = require('./../config.json');

module.exports = {
    ...new SlashCommandBuilder()
        .setName("censor")
        .setDescription("Adds words to the censor list")
        .addStringOption(option => option.setName("word").setDescription("Word to add to censor list").setRequired(true)),
    run: async (client, interaction, args) => {
        if (interaction.member.roles.cache.some(role => role.name === 'God')) {

            const word = interaction.options.getString("word");
            config.censorList.push(word);
            interaction.followUp("word added")
        } else {
            interaction.followUp("Insufficient permissions");
        }
    }

}
