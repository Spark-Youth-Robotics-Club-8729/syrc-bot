const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } =  require("@discordjs/voice");
const { QueryType } = require("discord-player")
const fs = require("fs");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("play")
        .setDescription("play a song in a voice channel!")
        .addStringOption(option => 
            option
                .setName("song")
                .setDescription("loads a song from a name or url")
                .setRequired(true)
        ),
    run: async (client, interaction, args) => {
        if (!interaction.member.voice.channel) {
            return interaction.reply("You need to be in a VC to use this command");
        }
        let rawdata = fs.readFileSync('./config.json');
        let config = JSON.parse(rawdata);
        var allowed_channels = [];
        for (i in config.musicchannel) {
            allowed_channels.push(config.musicchannel[i].channel_id);
        }
        if (!allowed_channels.includes(interaction.member.voice.channel.id)) {
            return interaction.reply("Playing music in this voice channel is prohibited");
        }
		const queue = await client.player.createQueue(interaction.guild);
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)
		let embed = new MessageEmbed()

		if (interaction.options.getString("song").startsWith("https://")) {
            let url = interaction.options.getString("song")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.reply("No results bruddah")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setAuthor({ name: song.author })
                .setThumbnail(song.thumbnail)
                .setColor('#5F75DE')
                .setFooter({ text: `Duration: ${song.duration}`})
		} else {
            let url = interaction.options.getString("song")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if (result.tracks.length === 0)
                return interaction.reply("No results bruddah")
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setAuthor({ name: song.author })
                .setThumbnail(song.thumbnail)
                .setColor('#5F75DE')
                .setFooter({ text: `Duration: ${song.duration}`})
		}
        await queue.setVolume(69);
        if (!queue.playing) await queue.play()
        await interaction.reply({
            embeds: [embed]
        })
    }
}