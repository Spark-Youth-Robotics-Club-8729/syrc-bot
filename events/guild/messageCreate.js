const { pgClient } = require("../../main");
const fs = require("fs");
const Filter = require('bad-words');
let botMsg = false;

module.exports = async (Discord, client, message) => {
    if (message.author.bot && message.channel.id !== "974471842704277524") {
        return;
    }
    if(botMsg){
        botMsg=false;
        return;
    }
    let filter = new Filter();
    let rawData = fs.readFileSync('./config.json');
    let config = JSON.parse(rawData);
    let censor = [];
    let uncensor = [];
    for (let i in config.censor) {
        censor.push(config.censor[i].word);
    }
    for (let i in config.uncensor) {
        uncensor.push(config.uncensor[i].word);
    }
    filter.addWords(...censor);
    filter.removeWords(...uncensor);
    if (filter.isProfane(message.content.toLowerCase()) && message.channel.id !== "925454253319921695") {
        let member = message.author.id.toString();
        const newEmbed = new Discord.MessageEmbed()
            .setTitle(`Message censored`)
            .addFields(
                {
                    name: 'Message content:', value: `||${message.content}||`, inline: true
                },
                {
                    name: 'Censored in: ', value: `${message.channel}`, inline: true
                },
                {
                    name: 'Message author: ', value: `${message.author}`, inline: true
                },
            )
            .setColor("#ff0000")
            .setTimestamp()
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setFooter('shame')
        client.channels.cache.get(config.logchannel[0].channel_id).send({ embeds: [newEmbed] });
        // await message.delete();
        message.react('GP:1145731266067578910');
        //if (message.content.toLowerCase().includes("owo") || message.content.toLowerCase().includes("owo")) {
            //message.channel.send({ content: `<@${member}> chill fam chill fam`, tts: true });
        //} else {
            //message.channel.send({ content: `No swearing <@${member}> :)`, tts: true });
        //}
    }
    const prefix = '!';
    //if(message.content.toLowerCase().includes(' gp ') || message.content.toLowerCase().includes(' gp') || message.content.toLowerCase().includes('gp ')){
    //    message.channel.send("Who are you, Tony?");
    //}
    try { // this needs to be fetched from config.json later
        if (message.channel.id === config.countingchannel[0].channel_id) {
            pgClient.query(`SELECT * FROM counting`, async (err, res) => {
                    if (message.content.startsWith(parseInt(res.rows[0].number)+1) && message.author.id !== res.rows[0].user_id) { // might not work idk if the [0] should be there :clown:
                        if(parseInt(Math.random()*20) === 2){
                            pgClient.query(`UPDATE counting SET number = ('${parseInt(res.rows[0].number)+2}'), user_id = ('${client.user.id}')`);
                            botMsg=true
                            await message.channel.send(`${parseInt(res.rows[0].number)+2}`);
                        } else{
                            pgClient.query(`UPDATE counting SET number = ('${parseInt(res.rows[0].number)+1}'), user_id = ('${message.author.id}')`);
                        }
                    } else {
                        await message.delete();
                    }
            })
        }
    } catch (TypeError) {
        console.log("No counting channel set... continuing");
    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    let allowed_channels = [];
    for (let i in config.botcomchannel) {
        allowed_channels.push(config.botcomchannel[i].channel_id);
    }
    if (!allowed_channels.includes(message.channel.id) && !message.content.startsWith("!clear") && !message.content.startsWith("!roles")) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);

    if (command) command.execute(client, message, args, Discord);
    
    if (message.author.bot) {
        let botcomChannel = '933859349753897041';
        client.channels.cache.get(botcomChannel).sendTyping();
    }
}
