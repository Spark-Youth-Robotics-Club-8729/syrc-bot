const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
module.exports = {
    ...new SlashCommandBuilder()
        .setName("censor")
        .setDescription("Adds words to the censor list")
        .addStringOption(option =>
            option
                .setName("mode")
                .setDescription("Select a mode")
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'delete', value: 'delete' },
                )
        )
        .addStringOption(option => option.setName("word").setDescription("Word to add to censor list").setRequired(true)),
    run: async (client, interaction, args) => {
        let rawdata = fs.readFileSync('./config.json');
        let config = JSON.parse(rawdata);
        let modroles = [];
        for (i in config.modrole) {
            modroles.push(config.modrole[i].role_id);
        }
        if (interaction.member.roles.cache.some(role => modroles.includes(role.id))) {
            const option = interaction.options.getString("mode");
            const word = interaction.options.getString("word");
            if (option == "add") {
                let rawdata = fs.readFileSync('./censorList.json');
                let censorFile = JSON.parse(rawdata);
                interaction.reply("Word added: **" + word + "**");
                censorFile.censorList.push(word);
                let configString = JSON.stringify(censorFile);
                fs.writeFile('./censorList.json', configString, err => {
                    if (err) {
                        console.log('Error storing data', err);
                    } else {
                        console.log('Successfully stored data!');
                    }
                })
            } else {
                
                let rawdata = fs.readFileSync('./censorList.json');
                let censorFile = JSON.parse(rawdata);
                var found = censorFile.censorList.indexOf(word);

                while (found !== -1) {
                    censorFile.censorList.splice(found, 1);
                    found = censorFile.censorList.indexOf(word);
                }
                let configString = JSON.stringify(censorFile);
                
                fs.writeFile('./censorList.json', configString, err => {
                    if (err) {
                        console.log('Error storing data', err);
                    } else {
                        console.log('Successfully stored data!');
                    }
                })
                interaction.reply("Word removed: **" + word + "**");
            }
        } else {
            interaction.reply("Insufficient permissions");
        }
    }

}