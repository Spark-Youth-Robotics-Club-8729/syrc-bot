const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("remove")
        .setDescription("removes a track from the queue")
        .addNumberOption(option =>
            option
                .setName('tracknumber')
                .setDescription('track number to remove')
                .setRequired(true)
        ),
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
        const trackNum = interaction.options.getNumber("tracknumber");
		const track = queue.remove(trackNum - 1);
        let newEmbed = {
            description: `**[${track.title}](${track.url})** has been removed from the queue`,
            color: '#5F75DE',
            timestamp: new Date()
        }
        await interaction.reply({ embeds: [newEmbed] });
    }
}
