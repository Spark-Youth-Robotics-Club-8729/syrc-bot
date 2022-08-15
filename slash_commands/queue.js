const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } =  require("@discordjs/voice");
const { QueryType } = require("discord-player")

module.exports = {
    ...new SlashCommandBuilder()
        .setName("queue")
        .setDescription("displays the song queue"),
    run: async (client, interaction, args) => {
        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: "You need to be in a VC to use this command", ephemeral: true });
        }
        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('queue_previouspage')
                                    .setStyle('PRIMARY')
                                    .setEmoji('<a:leftarrow:998601346355822642>'),
                                new MessageButton()
                                    .setCustomId('queue_nextpage')
                                    .setStyle('PRIMARY')
                                    .setEmoji('<a:rightarrow:998601359555297371>')
                            )
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.reply("There are no songs in the queue")
        }
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        var page = 0;
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` [${song.title}](${song.url}) | <@${song.requestedBy.id}>`
        }).join("\n")
        const currentSong = queue.current
        const progressBar = queue.createProgressBar();
        const secondsFormatted = ("0" + (((queue.totalTime + currentSong.durationMS) / 1000) % 60)).slice(-2);
        const duration = `Queue duration - ${Math.floor(((queue.totalTime + currentSong.durationMS) / 1000) / 60).toString()}:${secondsFormatted.toString()}`;
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Currently Playing**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` **[${currentSong.title}](${currentSong.url})** | <@${currentSong.requestedBy.id}>` : "None") + `\n${progressBar}` +
                    `\n\n**Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages} | ${duration}`
                    })
                    .setColor('#5F75DE')
                    .setThumbnail(currentSong.setThumbnail)
            ],
            components: [row]
        })
    }
}
