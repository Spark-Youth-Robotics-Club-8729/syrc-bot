const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
// const mysql = require(`mysql2`);
const Discord = require("discord.js");
const pgClient = require("../main");

// const syrcdb = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '!',
//     database: `syrcbot`
// });

module.exports = {
    ...new SlashCommandBuilder()
        .setName("meeting")
        .setDescription("creates a meeting")
        .addStringOption(option =>
            option
                .setName("datetime")
                .setDescription("Date and time meeting will take place")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option
                .setName("subteam")
                .setDescription("Which subteam should be pinged. Write their rolenames. If more than 1, seperate with spaces")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("notes")
                .setDescription("Any notes for the meeting")
                .setRequired(false)
        ),
    run: async (client, interaction, args, message) => {
        const datetime = interaction.options.getString("datetime");
        const subteams = interaction.options.getRole("subteam");
        const notes = interaction.options.getString("notes");
        if (notes === null) {
            notes = "N/A";
        }
        var date = new Date(datetime);
        console.log("SUBTEAM");
        console.log(subteams.id);
        await pgClient.query(`INSERT INTO meetings (start_time, subteam_id, notes) VALUES ('${date.getTime() / 1000}','${subteams.id}','${notes}')`, async (err, res) => {
            if (!err) {
                const newEmbed = new Discord.MessageEmbed()
                    .setTitle(`${subteams.name} meeting`)
                    .setColor("#5F75DE")
                    .setDescription(`Taking place on ${datetime}`)
                client.channels.cache.get(`997527933415592016`).send({ embeds: [newEmbed] });
                await pgClient.query(`INSERT INTO meetings (start_time, subteam_id, notes) VALUES ('${date.getTime() / 1000}','${subteams.id}','${notes}')`);
                await interaction.reply(`Meeting created`);
            } else {
                throw err;
            }
        })
    }
}