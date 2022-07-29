const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const { pgClient } = require("../main");
const fs = require("fs");

async function fetch_data() {
    var config = {};
    let tables = await pgClient.query(`SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`);
    for (i in tables.rows) {
        let res = await pgClient.query(`SELECT * FROM ${tables.rows[i].tablename}`);
        config[tables.rows[i].tablename] = res.rows;
    }
    console.log("DEBUG:");
    console.log(config);
    return config;
    // const configString = JSON.stringify(config);
    // fs.writeFile('./config.json', configString, err => {
    //     if (err) {
    //         console.log('Error fetching data', err);
    //     } else {
    //         console.log('Successfully fetched data!');
    //     }
    // })
}

module.exports = {
    ...new SlashCommandBuilder()
        .setName("debug")
        .setDescription("this command fixes things"),
    run: async (client, interaction, args) => {
        let config = await fetch_data();
        console.log("RETURNED CONFIG");
        console.log(config);
        delete config['typinglb'];
        await interaction.reply({ content: `\`\`\`json\n${JSON.stringify(config, null, 2)}\`\`\``, ephemeral: true });
    }
};
