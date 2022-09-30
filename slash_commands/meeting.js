const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
// const mysql = require(`mysql2`);
const Discord = require("discord.js");
const { pgClient } = require("../main");
const fs = require("fs");

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
                .setDescription("Date and time meeting will take place (YYYY-MM-DD HH:MM:SS). Note it is in 24 hour time.")
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
                .setName("location")
                .setDescription("Where this meeting will take place")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("notes")
                .setDescription("Any notes for the meeting")
                .setRequired(false)
        ),
    run: async (client, interaction, args, message) => {
        let rawdata = fs.readFileSync('./config.json');
        let config = JSON.parse(rawdata);
        let modroles = [];
        for (i in config.modrole) {
            modroles.push(config.modrole[i].role_id);
        }
        if (interaction.member.roles.cache.some(role => modroles.includes(role.id))) {
            console.log("hi");
            const datetime = interaction.options.getString("datetime");
            const subteams = interaction.options.getRole("subteam");
            var notes = interaction.options.getString("notes");
            const location = interaction.options.getString("location");
            if (notes === null) {
                notes = "N/A";
            }
            console.log(notes);
            var date = new Date(datetime);
            var curDate = new Date();
            if (Number.isNaN(date.getTime()/1000)) {
                return await interaction.reply('Incorrect date and time formatting');
            } else if (curDate.getTime() > date.getTime()) {
                return await interaction.reply("Time traveling isn't allowed sorry");
            }
            const newEmbed = new Discord.MessageEmbed()
                        .setTitle(`${subteams.name.toUpperCase()} meeting`)
                        .setColor("#5F75DE")
                        .setDescription(`**Starting:** <t:${date.getTime() / 1000}:R>`)
                        .addField( "Notes", `*${notes}*` )
                        .addField( "Location", `*${location}*` )
                        .setThumbnail('https://i.postimg.cc/dQjY2YNS/Screen-Shot-2022-03-07-at-9-00-41-PM.png')
            let channel = client.channels.cache.get(config.meetingchannel[0].channel_id);
            let msg = await channel.send({ embeds: [newEmbed] });
            let link = `https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}`;
            config.meetings.push({"start_time": (date.getTime() / 1000).toString(), "subteam_id": subteams.id, "notes": notes, "msg_link": link, "location": location});
            const configString = JSON.stringify(config);
            fs.writeFile('./config.json', configString, err => {
                if (err) {
                    console.log('Error fetching data', err);
                } else {
                    console.log('Successfully fetched data!');
                }
            })
            let formattedNotes = notes.replaceAll("'", "''");
            await pgClient.query(`INSERT INTO meetings (start_time, subteam_id, notes, msg_link, location) VALUES ('${date.getTime() / 1000}','${subteams.id}','${formattedNotes}', '${link}', '${location}')`, async (err, res) => {
                if (!err) {
                    await interaction.reply(`Meeting created`);
                } else {
                    await interaction.reply(`Ewah`);
                    console.log(err);
                    throw err;
                }
            })
        } else{
            interaction.followUp("Insufficient Permissions");
        }
    }
}
