const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

module.exports = {
    // channel, title, description - colour, footer, image url
    ...new SlashCommandBuilder()
        .setName("embed")
        .setDescription("creates an embed with the bot")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription('Set the channel where you want bot to send the message')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("Title of the embed")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("Description of the embed")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("colour")
                .setDescription("Colour of the embed in hexcode")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("footer")
                .setDescription("Footer of the embed")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("image")
                .setDescription("Image displayed in the embed as a url")
                .setRequired(false)
        ),
    run: async (client, interaction, args) => {
        const channel = interaction.options.getChannel("channel");
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");
        let colour = interaction.options.getString("colour");
        if (!colour) {
            colour = "#5F75DE"
        } else if (colour[0] != "#") {
            colour = "#" + colour;
        }
        const footer = interaction.options.getString("footer");
        const image = interaction.options.getString("image");
        let newEmbed = {
            title: title,
            description: description,
            color: colour,
            footer: {
                text: footer,
                icon_url: 'https://i.postimg.cc/dQjY2YNS/Screen-Shot-2022-03-07-at-9-00-41-PM.png',
            },
            timestamp: new Date(),
            image: {
                url: image
            },
        }
        try {
            channel.send({ embeds: [newEmbed] });
            await interaction.followUp({ content: "Embed created successfully!" });
        } catch {
            await interaction.followUp({ content: "Error creating embed" });
        }
    }
};