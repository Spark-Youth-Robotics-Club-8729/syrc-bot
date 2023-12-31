const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("help")
        .setDescription("get info on all of sparky's commands"),
    run: async (client, interaction, _args) => {
        let commandFields = [];
        client.slashCommands.forEach((value, commandName) => {
            let commandArgs = " ";
            value.options.forEach((value, _key) => {
                if (value.required) {
                    commandArgs += "<" + value.name + "> ";
                } else {
                    commandArgs += "[" + value.name + "] ";
                }
            })
            commandFields.push({ name: commandName + commandArgs, value: value.description, inline: true});
        })
        const newEmbed = {
            title: 'Help Menu',
            description: "*<> are required, [] are optional*",
            color: '#5F75DE',
            thumbnail: {
                url: 'https://i.postimg.cc/dQjY2YNS/Screen-Shot-2022-03-07-at-9-00-41-PM.png',
            },
            author: {
                name: 'SYRC Bot Help Command',
                icon_url: `https://i.postimg.cc/dQjY2YNS/Screen-Shot-2022-03-07-at-9-00-41-PM.png`,
                url: 'https://discord.js.org',
            },
            timestamp: new Date(),
            fields: commandFields,
        }
        await interaction.reply({ embeds: [newEmbed] });
    }
};
