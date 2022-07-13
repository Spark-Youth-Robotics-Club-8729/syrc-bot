const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

module.exports = {
    // channel, title, description - colour, footer, image url
    ...new SlashCommandBuilder()
        .setName("echo")
        .setDescription("echoes your message in a certain channel")
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("Text that you want to echo")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription('Set the channel where you want bot to send the message')
                .setRequired(false)
        ),
    run: async (client, interaction, args) => {
        const msg = interaction.options.getString("text");
        const chnl = interaction.options.getChannel("channel");
        if (chnl) {
            chnl.send(msg);
        } else {
            interaction.followUp({ content: msg });
        }
    }
};