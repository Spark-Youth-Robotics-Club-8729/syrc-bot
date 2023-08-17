const Discord = require('discord.js');
const fs = require("fs");
const pg = require('pg');
const { Player } = require("discord-player")
require("dotenv").config();
let express = require('express');
let app = express();

const client = new Discord.Client({ 
    partials: ["MESSAGE", "CHANNEL", "REACTION"], 
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_VOICE_STATES, "GUILDS", "GUILD_VOICE_STATES"] 
});

app.set('port', (process.env.PORT || 8080));

app.get('/', function(request, response) {
    let result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        require: false,
        rejectUnauthorized: false
    }
});

pgClient.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to PostgreSQL!");
    }
});

module.exports = { pgClient };

function initdb() {
    pgClient.query(`CREATE TABLE IF NOT EXISTS modrole (role_id varchar(32) primary key)`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS meetingchannel (channel_id varchar(32) primary key)`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS botcomchannel (channel_id varchar(32) primary key)`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS musicchannel (channel_id varchar(32) primary key)`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS welcomechannel (channel_id varchar(32) primary key)`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS countingchannel (channel_id varchar(32) primary key)`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS logchannel (channel_id varchar(32) primary key)`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS censor (word varchar(32) primary key)`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS uncensor (word varchar(32) primary key)`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS counting (number varchar(16) primary key, user_id varchar(32))`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS reaction (role_id varchar(32) primary key, channel_id varchar(32), emoji_id varchar(32), message_id varchar(32))`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS typinglb (wpm varchar(8) primary key, member_id varchar(32), accuracy varchar(8), text varchar(1024), time varchar(8), gross_wpm varchar(8), date varchar(32))`)
    pgClient.query(`CREATE TABLE IF NOT EXISTS meetings (start_time varchar(32) primary key, subteam_id varchar(64), notes varchar(1024), msg_link varchar(128))`)
}

initdb();

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message) await reaction.message.fetch();
    if (reaction) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;
    let rawdata = fs.readFileSync('./config.json');
    const config = JSON.parse(rawdata);
    for (let i in config.reaction) {
        if (reaction.message.id === config.reaction[i].message_id && reaction.emoji.name === config.reaction[i].emoji_id) {
            const member = reaction.message.guild.members.cache.get(user.id);
            const role = reaction.message.guild.roles.cache.get(config.reaction[i].role_id);
            await member.roles.add(config.reaction[i].role_id);
            await user.send({ content: `**${reaction.message.guild.name}:** Added the role [*` + role.name + "*]" });
        }
    }
})

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message) await reaction.message.fetch();
    if (reaction) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;
    let rawdata = fs.readFileSync('./config.json');
    const config = JSON.parse(rawdata);
    for (let i in config.reaction) {
        if (reaction.message.id === config.reaction[i].message_id && reaction.emoji.name === config.reaction[i].emoji_id) {
            const member = reaction.message.guild.members.cache.get(user.id);
            const role = reaction.message.guild.roles.cache.get(config.reaction[i].role_id);
            await member.roles.remove(config.reaction[i].role_id);
            await user.send({ content: `**${reaction.message.guild.name}:** Removed the role [*` + role.name + "*]" });
        }
    }
})

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.slashCommands = new Discord.Collection();

const player = new Player(client);
client.player = player;

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(process.env.TOKEN);
