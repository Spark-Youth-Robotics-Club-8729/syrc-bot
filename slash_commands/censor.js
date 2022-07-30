const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
const { pgClient } = require("../main");

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
                    { name: 'remove', value: 'remove' },
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
            let rawData = fs.readFileSync('./config.json');
            let config = JSON.parse(rawData);
            if (option == "add") {
                interaction.reply("Word added: **" + word + "**");
                config.censor.push({"word": word});
                var found = config.uncensor.indexOf({"word": word});
                while (found != -1) {
                    config.uncensor.splice(found, 1);
                    found = config.uncensor.indexOf({"word": word});
                }
                pgClient.query(`INSERT INTO censor VALUES ('${word}')`);
                pgClient.query(`DELETE FROM uncensor WHERE word = '${word}'`);
                let configString = JSON.stringify(config);
                fs.writeFile('./config.json', configString, err => {
                    if (err) {
                        console.log('Error storing data', err);
                    } else {
                        console.log('Successfully stored data!');
                    }
                })
            } else if (option == "remove") {
                pgClient.query(`DELETE FROM censor WHERE word = '${word}'`);
                pgClient.query(`INSERT INTO uncensor VALUES ('${word}')`)
                var found = config.censor.indexOf({"word": word});
                while (found != -1) {
                    config.censor.splice(found, 1);
                    found = config.censor.indexOf({"word": word});
                }
                config.uncensor.push({"word": word});
                interaction.reply("Word removed: **" + word + "**");
            }
            let configString = JSON.stringify(config);
            fs.writeFile('./config.json', configString, err => {
                if (err) {
                    console.log('Error storing data', err);
                } else {
                    console.log('Successfully stored data!');
                }
            })
        } else {
            interaction.reply("Insufficient permissions");
        }
    }

}
