const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const reddit = require("reddit-fetch");
const Discord = require("discord.js");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("meme")
        .setDescription("mimema: unit of cultural information spread by imitation"),
    run: async (client, interaction, args) => {
        reddit({
            subreddit: 'BreadStapledToTrees',
            sort: 'all',
            allowNSFW: false,
            allowModPost: true,
            allowCrossPost: true
        }).then(async post => {
            const newEmbed = new Discord.MessageEmbed()
                .setTitle(`${post.title}`)
                .setColor("#5F75DE")
                .setTimestamp()
                .setImage(`${post.url}`)
                .setURL(`https://www.reddit.com/${post.permalink}`)
            await interaction.reply({ embeds: [newEmbed] });
        });
    }
}
