// const mysql = require(`mysql2`);
const Discord = require("discord.js");
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
    
    //Checking database, and sending reminder for meetings
    // var interval = setInterval(function () {

    //     const syrcdb = mysql.createConnection({
    //         host: 'localhost',
    //         user: 'root',
    //         password: '!',
    //         database: `syrcbot`
    //     })

    //     syrcdb.connect(function (err) {
    //         syrcdb.query(`SELECT * FROM syrcbot.meetings`, (err, syrc) => {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 var date = new Date();
    //                 for (i in syrc) {
    //                     console.log(syrc[i].StartTime - date.getTime() / 1000)
    //                     if (syrc[i].StartTime - date.getTime() / 1000 < 605 && syrc[i].StartTime - date.getTime() / 1000 > 595) {
    //                         let role = syrc[i].Subteam.toString();
    //                         const newEmbed = new Discord.MessageEmbed()
    //                             .setTitle(`Reminder!`)
    //                             .setColor("#5F75DE")
    //                             .setDescription(`<@&${role}> meeting in 10 MINUTES`)
    //                         client.channels.cache.get(`997528503396335737`).send({ embeds: [newEmbed] });
    //                         syrcdb.query(`DELETE FROM meetings WHERE StartTime = ${syrc[i].StartTime}`);
    //                     } else if (syrc[i].StartTime - date.getTime() / 1000 > 3595 && syrc[i].StartTime - date.getTime() / 1000 < 3605) {

    //                         let role = syrc[i].Subteam.toString();
    //                         const newEmbed = new Discord.MessageEmbed()
    //                             .setTitle(`Reminder!`)
    //                             .setColor("#5F75DE")
    //                             .setDescription(`<@&${role}> meeting in 1 HOUR`)
    //                         client.channels.cache.get(`997528503396335737`).send({ embeds: [newEmbed] });
    //                     } else if (syrc[i].StartTime - date.getTime() / 1000 > 86395 && syrc[i].StartTime - date.getTime() / 1000 < 86405) {

    //                         let role = syrc[i].Subteam.toString();
    //                         const newEmbed = new Discord.MessageEmbed()
    //                             .setTitle(`Reminder!`)
    //                             .setColor("#5F75DE")
    //                             .setDescription(`<@&${role}> meeting tommorow!`)
    //                         client.channels.cache.get(`997528503396335737`).send({ embeds: [newEmbed] });
    //                     }
    //                 }
    //             }
    //         })
    //     });

    // }, 10000);
}
