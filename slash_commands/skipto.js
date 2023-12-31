const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("skips to a certain song in the queue")
        .addStringOption(option => 
            option
                .setName("tracknumber")
                .setDescription("track number of the song you want to skip to")
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
        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length) {
            let newEmbed = {
                description: "Invalid track number",
                color: '#5F75DE',
                timestamp: new Date()
            }
            return await interaction.reply({ embeds: [newEmbed] });
        }
		queue.skipTo(trackNum - 1);
        let newEmbed = {
            description: `Skipped ahead to track number ${trackNum}`,
            color: '#5F75DE',
            timestamp: new Date()
        }
        await interaction.reply({ embeds: [newEmbed] })
    }
}
