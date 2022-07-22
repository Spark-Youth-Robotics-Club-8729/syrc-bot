const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } =  require("@discordjs/voice");
const { QueryType } = require("discord-player")

module.exports = {
    ...new SlashCommandBuilder()
        .setName("leave")
        .setDescription("leaves the voice channel and clears the queue"),
    run: async (client, interaction, args) => {
        if (!interaction.member.voice.channel) {
            return interaction.reply("You need to be in a VC to use this command");
        }
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue) {
            let newEmbed = {
                description: "There are no songs in the queue",
                color: '#5F75DE',
                timestamp: new Date()
            }
            return await interaction.reply({ embeds: [newEmbed] });
        }
		queue.destroy();
        let newEmbed = {
            description: "See you next time~",
            color: '#5F75DE',
        }
        await interaction.reply({ embeds: [newEmbed] });
    }
}