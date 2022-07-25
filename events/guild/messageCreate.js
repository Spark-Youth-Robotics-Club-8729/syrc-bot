const { pgClient } = require("../../main");
const fs = require("fs");

module.exports = async (Discord, client, message) => {
    let rawdata = fs.readFileSync('./config.json');
    let config = JSON.parse(rawdata);
    if (message.content.toLowerCase().startsWith("im ")) {
        await message.channel.send(`Hi ${message.content.substring(3)}, I'm dad!`);
    } else if (message.content.toLowerCase().startsWith("i'm ")) {
        await message.channel.send(`Hi ${message.content.substring(4)}, I'm dad!`);
    }
    const prefix = '!';
    if(message.content.toLowerCase().includes('gp')){
        message.channel.send("Who are you, Tony?");
    }
    if(parseInt(Math.random()*100)==2){
        message.channel.send("Who Asked?");
    }

    if (message.channel.id == config.countingchannel[0].channel_id) { // this needs to be fetched from config.json later
        pgClient.query(`SELECT * FROM counting`, async (err, res) => {
            
            console.log(res.rows[0].number);
        if (message.content.startsWith(parseInt(res.rows[0].number)+1)) { // might not work idk if the [0] should be there :clown:
            pgClient.query(`UPDATE counting SET number = ('${parseInt(res.rows[0].number)+1}')`);
        } else {
            message.channel.bulkDelete(1);
        }
    })
    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    var allowed_channels = [];
    for (i in config.botcomchannel) {
        allowed_channels.push(config.botcomchannel[i].channel_id);
    }
    if (!allowed_channels.includes(message.channel.id) && message.content.startsWith("!clear") == false && message.content.startsWith("!roles") == false) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);

    if (command) command.execute(client, message, args, Discord);
}