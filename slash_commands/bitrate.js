const { SlashCommandBuilder } = require("@discordjs/builders");
// const { QueryType } = require("discord-player")

module.exports = {
    ...new SlashCommandBuilder()
        .setName("bitrate")
        .setDescription("change the bitrate of the music player")
        .addNumberOption(option => 
            option
                .setName("bitratevalue")
                .setDescription("set the bitrate value")
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
        const bitratevalue = interaction.options.getNumber("bitratevalue")
		queue.setBitrate(bitratevalue);
        let newEmbed = {
            description: `Set music player bitrate to **${bitratevalue.toString()}**`,
            color: '#5F75DE',
            timestamp: new Date()
        }
        await interaction.reply({ embeds: [newEmbed] })
    }
}
