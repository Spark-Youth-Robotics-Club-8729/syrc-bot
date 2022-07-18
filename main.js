const Discord = require('discord.js');
const config = require('./config.json')
const { Client, Intents } = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
// const mysql = require('mysql2')
const pg = require('pg')

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

const conf = {
    user: 'jddzirgvzabydk',
    database: 'd8769d1odt2t1p',
    password: 'ada356e77388afa00b7301630272c81e9ba305a00cfd04aef1a8edd4c8714a74',
    host: 'ec2-54-87-179-4.compute-1.amazonaws.com',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 50000,
};
var pool = new pg.Pool(conf);
module.exports = pool;


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

client.login(config.token);
