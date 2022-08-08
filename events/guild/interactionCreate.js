const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { pgClient } = require("../../main");
const queueFile = require("../../slash_commands/queue");
const fs = require("fs");

module.exports = async (Discord, client, interaction) => {
    let rawdata = fs.readFileSync('./config.json');
    let config = JSON.parse(rawdata);
    var allowed_channels = [];
    for (i in config.botcomchannel) {
        allowed_channels.push(config.botcomchannel[i].channel_id);
    }
    const target = await interaction.guild.members.fetch(interaction.user.id);
    const cmd = client.slashCommands.get(interaction.commandName);
    if (target.permissions.has("ADMINISTRATOR") || allowed_channels.length == 0 || interaction.commandName == 'clear' || allowed_channels.includes(interaction.channel.id)){
        if (interaction.isCommand()) {
            if (!cmd)
                return interaction.reply({ content: "An error has occured " });
            const args = [];
            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);
            cmd.run(client, interaction, args);
        } else if (interaction.isSelectMenu()) {
            if (interaction.customId == "placement") {
                pgClient.query(`SELECT * FROM typinglb`, async (err, res) => {
                    if (!err) {
                        var typinglb = res.rows;
                        let score = typinglb[parseInt(interaction.values)-1];
                        let member = await interaction.guild.members.fetch(score['member_id']);
                        let newEmbed = {
                            title: "#" + interaction.values.toString() + " - " + score["wpm"] + " wpm",
                            description: `*\"${score["text"]}\"*`,
                            color: '#5F75DE',
                            timestamp: new Date(),
                            fields: [
                                { name: "Accuracy", value: score["accuracy"] + "%" },
                                { name: "Member", value: member.user.username },
                                { name: "Time taken", value: score["time"] + " seconds" },
                                { name: "Gross wpm", value: score["gross_wpm"] + " wpm" },
                                { name: "Date", value: score["date"] }
                            ]
                        }
                        await interaction.reply({ embeds: [newEmbed], ephemeral: true });
                    } else {
                        throw err;
                    }
                });
            }
        } else if (interaction.isButton()) {
            if (interaction.customId == "queue_previouspage") {
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
                const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
                let embed = interaction.message.embeds[0];
                let page = parseInt(embed.footer.text.split(' ')[1])-1;
                if (page - 1 >= 0) {
                    page -= 1;
                }
                const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
                    return `**${page * 10 + i + 1}.** \`[${song.duration}]\` [${song.title}](${song.url}) | <@${song.requestedBy.id}>`
                }).join("\n")
                const currentSong = queue.current
                const secondsFormatted = ("0" + (((queue.totalTime + currentSong.durationMS) / 1000) % 60)).slice(-2);
                const duration = `Queue duration - ${Math.floor(((queue.totalTime + currentSong.durationMS) / 1000) / 60).toString()}:${secondsFormatted.toString()}`;
                await interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`**Currently Playing**\n` + 
                            (currentSong ? `\`[${currentSong.duration}]\` [${currentSong.title}](${currentSong.url}) | <@${currentSong.requestedBy.id}>` : "None") +
                            `\n\n**Queue**\n${queueString}`
                            )
                            .setFooter({
                                text: `Page ${page + 1} of ${totalPages} | ${duration}`
                            })
                            .setThumbnail(currentSong.setThumbnail)
                    ],
                    components: [row]
                })
            } else if (interaction.customId == "queue_nextpage") {
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
                const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
                let embed = interaction.message.embeds[0];
                let page = parseInt(embed.footer.text.split(' ')[1])-1;
                if (page + 1 <= totalPages-1) {
                    page += 1;
                }
                const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
                    return `**${page * 10 + i + 1}.** \`[${song.duration}]\` [${song.title}](${song.url}) | <@${song.requestedBy.id}>`
                }).join("\n")
                const currentSong = queue.current
                const secondsFormatted = ("0" + (((queue.totalTime + currentSong.durationMS) / 1000) % 60)).slice(-2);
                const duration = `Queue duration - ${Math.floor(((queue.totalTime + currentSong.durationMS) / 1000) / 60).toString()}:${secondsFormatted.toString()}`;
                await interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`**Currently Playing**\n` + 
                            (currentSong ? `\`[${currentSong.duration}]\` [${currentSong.title}](${currentSong.url}) | <@${currentSong.requestedBy.id}>` : "None") +
                            `\n\n**Queue**\n${queueString}`
                            )
                            .setFooter({
                                text: `Page ${page + 1} of ${totalPages} | ${duration}`
                            })
                            .setThumbnail(currentSong.setThumbnail)
                    ],
                    components: [row]
                })
            }
        }
    } else{
        interaction.reply({ content: "Not allowed to use commands in this channel", ephemeral: true});
    }
}
