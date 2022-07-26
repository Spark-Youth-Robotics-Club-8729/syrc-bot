const { pgClient } = require("../../main");
const fs = require("fs");
const config = require('./../../config.json');

module.exports = async (Discord, client, message) => {
    if (message.author.bot) {
        return;
    }   
    if (message.content.toLowerCase().startsWith("im ")) {
        await message.channel.send(`Hi ${message.content.substring(3)}, I'm dad!`);
    } else if (message.content.toLowerCase().startsWith("i'm ")) {
        await message.channel.send(`Hi ${message.content.substring(4)}, I'm dad!`);
    }
    let rawdata = fs.readFileSync('./censorList.json');
    let censorFile = JSON.parse(rawdata);
    for (var i = 0; i < censorFile.censorList.length; i++) {
        if (message.content.toLowerCase().includes(censorFile.censorList[i])){
            console.log(censorFile.censorList[i]);
            member = message.author.id.toString();
            await message.delete();
            if (censorFile.censorList[i]=="owo" || censorFile.censorList[i] == "uwu") {
                message.channel.send({ content: `<@${member}> ur a stinky furry :)`, tts: true });
                break
            } else {
                message.channel.send({ content: `No swearing <@${member}> :)`, tts: true });
                break
            }
        }
    }
    const prefix = '!';
    if(message.content.toLowerCase().includes('gp')){
        message.channel.send("Who are you, Tony?");
    }
    if(parseInt(Math.random()*100)==2){
        message.channel.send("no one asked?");
    }
    let rawdata1 = fs.readFileSync('./config.json');
    let config = JSON.parse(rawdata1);
    if (message.channel.id == config.countingchannel[0].channel_id) { // this needs to be fetched from config.json later
        pgClient.query(`SELECT * FROM counting`, async (err, res) => {
            if (message.content.startsWith(parseInt(res.rows[0].number)+1) && message.author.id != res.rows[0].user_id) { // might not work idk if the [0] should be there :clown:
                pgClient.query(`UPDATE counting SET number = ('${parseInt(res.rows[0].number)+1}'), user_id = ('${message.author.id}')`);
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
