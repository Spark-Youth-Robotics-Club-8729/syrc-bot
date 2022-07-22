// const mysql = require(`mysql2`);
const Discord = require("discord.js");
const { pgClient } = require("../../main");
require("dotenv").config();

module.exports = async (Discord, client) => {
    console.log('Bot is online!');
    const guild = client.guilds.cache.get('974812609704501318');
    client.user.setPresence({
        status: "online",
        activities: [{
            name: `!help | Stalking ${guild.memberCount} humans`,
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=8SIiGo3TVKE",
            details: "sparky :D"
        }]
    });
    var interval = setInterval(async function () {
        await pgClient.query(`SELECT * FROM meetings`, (err, syrc) => {
            if (err) {
                throw err;
            } else {
                var date = new Date();
                for (i in syrc.rows) {
                    console.log(syrc.rows[i].start_time - date.getTime() / 1000);
                    let role = syrc.rows[i].subteam_id.toString();
                    let msg_link = syrc.rows[i].msg_link;
                    if (syrc.rows[i].start_time - date.getTime() / 1000 < 0) {
                        pgClient.query(`DELETE FROM meetings WHERE start_time = '${syrc.rows[i].start_time}'`);
                    } else if (syrc.rows[i].start_time - date.getTime() / 1000 < 605 && syrc.rows[i].start_time - date.getTime() / 1000 > 595) {
                        const newEmbed = new Discord.MessageEmbed()
                            .setTitle(`Reminder!`)
                            .setColor("#5F75DE")
                            .setDescription(`<@&${role}> meeting in 10 MINUTES\n**[Meeting Message](${msg_link})**`)
                        client.channels.cache.get(`997528503396335737`).send({ embeds: [newEmbed] });
                        pgClient.query(`DELETE FROM meetings WHERE start_time = '${syrc.rows[i].start_time}'`);
                    } else if (syrc.rows[i].start_time - date.getTime() / 1000 > 3595 && syrc.rows[i].start_time - date.getTime() / 1000 < 3605) {
                        const newEmbed = new Discord.MessageEmbed()
                            .setTitle(`Reminder!`)
                            .setColor("#5F75DE")
                            .setDescription(`<@&${role}> meeting in 1 HOUR\n**[Meeting Message](${msg_link})**`)
                        client.channels.cache.get(`997528503396335737`).send({ embeds: [newEmbed] });
                    } else if (syrc.rows[i].start_time - date.getTime() / 1000 > 86395 && syrc.rows[i].start_time - date.getTime() / 1000 < 86405) {

                        const newEmbed = new Discord.MessageEmbed()
                            .setTitle(`Reminder!`)
                            .setColor("#5F75DE")
                            .setDescription(`<@&${role}> meeting tommorow!\n**[Meeting Message](${msg_link})**`)
                        client.channels.cache.get(`997528503396335737`).send({ embeds: [newEmbed] });
                    }
                }
            }
        })
    }, 10000);
}
