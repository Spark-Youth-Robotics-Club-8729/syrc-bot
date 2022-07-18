const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const mysql = require(`mysql2`);
const Discord = require("discord.js")

const syrcdb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '!',
    database: `syrcbot`
});

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
        console.log(subteams);
        const notes = interaction.options.getString("notes");
        var date = new Date(datetime);
        syrcdb.connect(function (err) {
            if (err) {
                console.log(err);
            } else {
                syrcdb.query(`INSERT INTO meetings (StartTime, Subteam, Notes) VALUES ('${date.getTime() / 1000}','${subteams.id}','${notes}')`);
                const newEmbed = new Discord.MessageEmbed()
                    .setTitle(`${subteams.name} meeting`)
                    .setColor("#5F75DE")
                    .setDescription(`Taking place on ${datetime}`)
                client.channels.cache.get(`997527933415592016`).send({ embeds: [newEmbed] });
                interaction.followUp(`Meeting created`);
            }
        });
    }
}