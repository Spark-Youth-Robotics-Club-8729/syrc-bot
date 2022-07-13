const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("ping")
        .setDescription("this is a ping command!"),
    run: async (client, interaction, args) => {
        const newEmbed = {
            color: '#5F75DE',
            title: "Pong! 🏓",
            fields: [
                { name: "Latency", value: `${Math.abs(Date.now() - interaction.createdTimestamp)} ms`, inline: true },
                { name: "API Latency", value: `${Math.round(client.ws.ping)} ms`, inline: true }
            ]
        }
        await interaction.followUp({ embeds: [newEmbed] });
    }
}