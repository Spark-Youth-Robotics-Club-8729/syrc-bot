// const mysql = require(`mysql2`);
const Discord = require("discord.js");
const { pgClient } = require("../../main");
require("dotenv").config();
const fs = require("fs");

async function fetch_data() {
    var config = {};
    let tables = await pgClient.query(`SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`);
    for (i in tables.rows) {
        let res = await pgClient.query(`SELECT * FROM ${tables.rows[i].tablename}`);
        config[tables.rows[i].tablename] = res.rows;
    }
    console.log(config);
    const configString = JSON.stringify(config);
    fs.writeFile('./config.json', configString, err => {
        if (err) {
            console.log('Error fetching data', err);
        } else {
            console.log('Successfully fetched data!');
        }
    })
}

module.exports = async (Discord, client) => {
    const guilds = client.guilds.cache.map(guild => guild.id);
    let members = 0;
    for (guild in guilds) {
        members += parseInt(client.guilds.cache.get(guilds[guild]).memberCount);
    }
    client.user.setPresence({
        status: "online",
        activities: [{
            name: `/help | Stalking ${members} humans`,
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=8SIiGo3TVKE",
            details: `This one sparks joy :]`
        }]
    });
    fetch_data();
    console.log('Bot is online!');
    let rawdata = fs.readFileSync('./config.json');
    let config = JSON.parse(rawdata);
    // im lazy imma just hardcode the reminder channel stfu darun no one asked >:(
    let reminderChannel = '1001656037243367514';
    let botcomChannel = '933859349753897041';
    var interval = setInterval(async function () {
        client.channels.cache.get(botcomChannel).sendTyping();
        await pgClient.query(`SELECT * FROM meetings`, async (err, syrc) => {
            if (err) {
                throw err;
            } else {
                var date = new Date();
                for (i in syrc.rows) {
                    console.log(`${((syrc.rows[i].start_time - date.getTime() / 1000)/60)} minutes left`);
                    console.log(syrc.rows[i].start_time - date.getTime() / 1000);
                    let role = syrc.rows[i].subteam_id.toString();
                    let msg_link = syrc.rows[i].msg_link;
                    if (syrc.rows[i].start_time - date.getTime() / 1000 < -600) {
                        pgClient.query(`DELETE FROM meetings WHERE start_time = '${syrc.rows[i].start_time}'`);
                        let msgSplit = msg_link.split('/');
                        let msgChannel = client.channels.cache.get(msgSplit[5]);
                        let msg = await msgChannel.messages.fetch(msgSplit[6]);
                        console.log(msg)
                        await msg.delete();
                        pgClient.query(`DELETE FROM meetings WHERE start_time = '${syrc.rows[i].start_time}'`);
                    } else if (syrc.rows[i].start_time - date.getTime() / 1000 < 605 && syrc.rows[i].start_time - date.getTime() / 1000 > 595) {
                        const newEmbed = new Discord.MessageEmbed()
                            .setTitle(`Reminder!`)
                            .setColor("#5F75DE")
                            .setDescription(`<@&${role}> meeting in **10 MINUTES**\n**[Meeting Message](${msg_link})**`)
                        client.channels.cache.get(reminderChannel).send({ embeds: [newEmbed], content: `||<@&${role}>||` });
                    } else if (syrc.rows[i].start_time - date.getTime() / 1000 > 3595 && syrc.rows[i].start_time - date.getTime() / 1000 < 3605) {
                        const newEmbed = new Discord.MessageEmbed()
                            .setTitle(`Reminder!`)
                            .setColor("#5F75DE")
                            .setDescription(`<@&${role}> meeting in **1 HOUR**\n**[Meeting Message](${msg_link})**`)
                        client.channels.cache.get(reminderChannel).send({ embeds: [newEmbed], content: `||<@&${role}>||` });
                    } else if (syrc.rows[i].start_time - date.getTime() / 1000 > 86395 && syrc.rows[i].start_time - date.getTime() / 1000 < 86405) {
                        const newEmbed = new Discord.MessageEmbed()
                            .setTitle(`Reminder!`)
                            .setColor("#5F75DE")
                            .setDescription(`<@&${role}> meeting **TOMORROW**!\n**[Meeting Message](${msg_link})**`)
                        client.channels.cache.get(reminderChannel).send({ embeds: [newEmbed], content: `||<@&${role}>||` });
                    }
                }
            }
        })
    }, 9500);
}
