const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } =  require("@discordjs/voice");
const { QueryType } = require("discord-player")
const fs = require("fs");
const { getAudioDurationInSeconds } = require('get-audio-duration');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

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
            return interaction.reply({ content: "You need to be in a VC to use this command", ephemeral: true });
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
        await interaction.deferReply();
	if (!queue.connection) {
            const audioPlayer = createAudioPlayer();
            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
            connection.subscribe(audioPlayer);
            const resource = createAudioResource('./assets/welcome.mp3');
            audioPlayer.play(resource);
            await getAudioDurationInSeconds('./assets/welcome.mp3').then(async (duration) => {
                await sleep(duration*1000);
            })
            connection.destroy();
            await queue.connect(interaction.member.voice.channel);
        }
	let embed = new MessageEmbed()
	if (interaction.options.getString("song").startsWith("https://")) {
            let url = interaction.options.getString("song")
            const resultsong = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            const resultplaylist = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            let song = null;
            if (resultsong.tracks.length == 0 && resultplaylist.tracks.length == 0) {
                return interaction.editReply("No results brotha")
            } else if (resultplaylist.tracks.length == 0) {
                song = resultsong.tracks[0];
                await queue.addTrack(song)
            } else if (resultsong.tracks.length == 0) {
                song = resultplaylist.tracks[0];
                await queue.addTracks(resultplaylist.tracks);
            }
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
            if (result.tracks.length === 0) {
                return interaction.editReply("No results brotha")
	    }
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
        await interaction.editReply({
            embeds: [embed]
        })
    }
}
