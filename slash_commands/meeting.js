const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
// const mysql = require(`mysql2`);
const Discord = require("discord.js");
const { pgClient } = require("../main");

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
                .setDescription("Date and time meeting will take place (YYYY-MM-DD HH:MM:SS)")
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
        var notes = interaction.options.getString("notes");
        if (notes === null) {
            notes = "N/A";
        }
        var date = new Date(datetime);
        var curDate = new Date();
        if (Number.isNaN(date.getTime()/1000)) {
            return await interaction.reply('Incorrect date and time formatting');
        } else if (curDate.getTime() > date.getTime()) {
            return await interaction.reply("Time traveling isn't allowed sorry");
        }
        const newEmbed = new Discord.MessageEmbed()
                    .setTitle(`${subteams.name} meeting`)
                    .setColor("#5F75DE")
                    .setDescription(`**Starting:** <t:${date.getTime() / 1000}:R>`)
                    .addField( "Notes", `*${notes}*` )
        let channel = client.channels.cache.get(`997527933415592016`);
        let msg = await channel.send({ embeds: [newEmbed] });
        let link = `https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`;
        await pgClient.query(`INSERT INTO meetings (start_time, subteam_id, notes, msg_link) VALUES ('${date.getTime() / 1000}','${subteams.id}','${notes}', '${link}')`, async (err, res) => {
            if (!err) {
                await interaction.reply(`Meeting created`);
            } else {
                await interaction.reply(`Ewah`);
                throw err;
            }
        })
    }
}