const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("resume")
        .setDescription("resumes the music player"),
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
		queue.setPaused(false);
        let newEmbed = {
            description: "Music has been resumed!",
            color: '#5F75DE',
            timestamp: new Date()
        }
        await interaction.reply({ embeds: [newEmbed] });
    }
}
