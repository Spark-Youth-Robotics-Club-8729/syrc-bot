const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const Discord = require("discord.js");
const axios = require('axios');

module.exports = {
    ...new SlashCommandBuilder()
        .setName("joke")
        .setDescription("makes a haha funny joke"),
    run: async (client, interaction, args) => {
        let getJoke = async () => {
            let response = await axios.get('https://v2.jokeapi.dev/joke/Any?safe-mode');
            while (response.data.setup == undefined) {
                response = await axios.get('https://v2.jokeapi.dev/joke/Any?safe-mode');
            }
            let joke = response.data;
            return joke;
        }
        let jokeValue = await getJoke();
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#5F75DE')
            .addFields(
                { name: jokeValue.setup, value: jokeValue.delivery, inline: true },
            )
        await interaction.reply({ embeds: [newEmbed] });
    }
}