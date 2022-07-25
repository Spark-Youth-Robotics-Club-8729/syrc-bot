const fs = require("fs");

module.exports = (Discord, client, member) => {
    let rawdata = fs.readFileSync('./config.json');
    let config = JSON.parse(rawdata);
    // const targetChannelId = '985690065583898694';
    const message = `Welcome <@${member.id}> to first robotics team 8729: Sparkling H2O! Check out ${member.guild.channels.cache.get(1000805634821869601).toString()} to get roles. And ${member.guild.channels.cache.get(862089529698811934).toString()} for useful links throughout your journey. Awesome to have you here :)`;
    const channel = member.guild.channels.cache.get(config.welcomechannel[0].channel_id);

    channel.send(message);
}