const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
// const mysql = require('mysql2')
const pg = require('pg');
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
});

client.on('messageReactionRemove', async (reaction, user) => {
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
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.slashCommands = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

// better error handling
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(process.env.TOKEN);
