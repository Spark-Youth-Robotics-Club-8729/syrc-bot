const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } =  require("@discordjs/voice");
const { QueryType } = require("discord-player")

module.exports = {
    ...new SlashCommandBuilder()
        .setName("loop")
        .setDescription("loops the queue")
        .addStringOption(option =>
            option
                .setName("loopsetting")
                .setDescription("the loop type you want to enable")
                .addChoices(
                    { name: 'track', value: 'TRACK' },
                    { name: 'queue', value: 'QUEUE' },
                    { name: 'autoplay', value: 'AUTOPLAY' },
                    { name: 'off', value: 'OFF' },
                )
        ),
    run: async (client, interaction, args) => {
        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: "You need to be in a VC to use this command", ephemeral: true });
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
        const setting = interaction.options.getString("loopsetting");
        let value = 2;
        if (setting == 'TRACK') {
            value = 1;
        } else if (setting == 'OFF') {
            value = 0;
        } else if (setting == 'AUTOPLAY') {
            value = 3;
        } else if (setting == '') {
            setting = 'QUEUE';
        }
        queue.setRepeatMode(value);
        let newEmbed = {
            description: `Loop setting set to **${setting}**`,
            color: '#5F75DE',
        }
        await interaction.reply({ embeds: [newEmbed] });
    }
}