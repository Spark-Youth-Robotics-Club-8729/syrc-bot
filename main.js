const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, "GUILDS", "GUILD_VOICE_STATES"] });
// const mysql = require('mysql2')
const pg = require('pg');
const { Player } = require("discord-player")
require("dotenv").config();

// to fix heroku porting issues
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

const pgClient = new pg.Client({
    connectionString: process.env.HEROKU_URI,
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

module.exports = pgClient;

function initdb() {
    pgClient.query(`CREATE TABLE IF NOT EXISTS modrole (role_id varchar(32) primary key)`);
    pgClient.query(`CREATE TABLE IF NOT EXISTS typinglb (wpm varchar(8) primary key, member_id varchar(32), accuracy varchar(8), text varchar(1024), time varchar(8), gross_wpm varchar(8), date varchar(32))`)
    pgClient.query(`CREATE TABLE IF NOT EXISTS meetings (start_time varchar(32) primary key, subteam_id varchar(64), notes varchar(1024), msg_link varchar(128))`)
}

initdb();

// const syrcdb = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '!',
//     database: `syrcbot`
// })

// syrcdb.connect(function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Connected to MySQL database!");
//     }
// });

client.on('messageReactionAdd', async (reaction, user) => {

    console.log("HI");
    if (reaction.message) await reaction.message.fetch();
    if (reaction) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;
    if (reaction.message.id === '998976564261834752') {
        if (reaction.emoji.name === 'tongtong') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('998677484381941862')
        }
        console.log(reaction.emoji.name);
        if (reaction.emoji.name === '💀') {
            await reaction.message.guild.members.cache.get(user.id).roles.add('998677509954601041')
        }
    }
}
)

client.on('messageReactionRemove', async (reaction, user) => {

    console.log("HI");
    if (reaction.message) await reaction.message.fetch();
    if (reaction) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;
    if (reaction.message.id === '998976564261834752') {
        if (reaction.emoji.name === 'tongtong') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('998677484381941862')
        }
        console.log(reaction.emoji.name);
        if (reaction.emoji.name === '💀') {
            await reaction.message.guild.members.cache.get(user.id).roles.remove('998677509954601041')
        }
    }
}
)

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

// better error handling
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(process.env.TOKEN);
