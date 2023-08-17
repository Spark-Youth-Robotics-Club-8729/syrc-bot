const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("skip")
        .setDescription("skips the current song"),
    run: async (client, interaction, _args) => {
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
        const currentSong = queue.current;
		queue.skip()
        await interaction.reply({
            embeds: [
                new MessageEmbed().setDescription(`**[${currentSong.title}](${currentSong.url})** has been skipped!`).setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}
