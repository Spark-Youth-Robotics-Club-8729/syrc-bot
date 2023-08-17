const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
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
        )
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription('Set the user you want to send a message to')
                .setRequired(false)
        ),
    run: async (client, interaction, _args) => {
        const msg = interaction.options.getString("text");
        const channel = interaction.options.getChannel("channel");
        const user = interaction.options.getUser("user");
        if (channel && user) {
            await channel.send(msg);

            try {
                await user.send(msg);
                await interaction.reply({ content: "Echoes successful!", ephemeral: true });
            } catch (err) {
                await interaction.reply({ content: "I was unable to message the user, but the channel echo was successful", ephemeral: true });
            }
        } else if (channel && !user) {
            await channel.send(msg);
            await interaction.reply({ content: "Echo successful!", ephemeral: true });
        } else if (user && !channel) {
            try {
                await user.send(msg);
                await interaction.reply({ content: "Echo successful!", ephemeral: true });
            } catch (err) {
                await interaction.reply({ content: "I was unable to message the user", ephemeral: true });
            }
        } else {
            await interaction.channel.send(msg);
            await interaction.reply({ content: "Echo successful!", ephemeral: true });
        }
    }
};
