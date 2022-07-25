const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } =  require("@discordjs/voice");
const { QueryType } = require("discord-player")

module.exports = {
    ...new SlashCommandBuilder()
        .setName("boost")
        .setDescription("𝔹𝕆𝕆𝕆𝕆𝕆𝕆𝕆𝕆𝕆𝕆𝕆𝕆𝕆𝕆𝕊𝕋"),
    run: async (client, interaction, args) => {
        if (!interaction.member.voice.channel) {
            return interaction.reply("You need to be in a VC to use this command");
        }
		const queue = await client.player.createQueue(interaction.guild);
		if (!queue) {
            let newEmbed = {
                description: "There are no songs in the queue",
                color: '#5F75DE',
                timestamp: new Date()
            }
            return await interaction.reply({ embeds: [newEmbed] });
        }
        let newEmbed = {
            description: `**BOOSTED TO *${queue.volume + 300}***`,
            color: '#5F75DE'
        }
        await queue.setVolume(queue.volume + 300);
        await interaction.reply({
            embeds: [newEmbed]
        })
    }
}