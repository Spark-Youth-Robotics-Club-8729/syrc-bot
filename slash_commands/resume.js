const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } =  require("@discordjs/voice");
const { QueryType } = require("discord-player")

module.exports = {
    ...new SlashCommandBuilder()
        .setName("resume")
        .setDescription("resumes the music player"),
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
		queue.setPaused(false);
        let newEmbed = {
            description: "Music has been resumed!",
            color: '#5F75DE',
            timestamp: new Date()
        }
        await interaction.reply({ embeds: [newEmbed] });
    }
}