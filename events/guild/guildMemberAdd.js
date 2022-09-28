const fs = require("fs");

module.exports = (Discord, client, member) => {
    
    let rawdata = fs.readFileSync('./config.json');
    let config = JSON.parse(rawdata);
    const rolechannel = member.guild.channels.cache.get('1000805634821869601');
    const linkschannel = member.guild.channels.cache.get('862089529698811934');
    const message = `Welcome <@${member.id}> to FRC team 8729: Sparkling H2O! Check out ${rolechannel} to get roles and ${linkschannel} for useful links throughout your journey. Awesome to have you here :D`;
    const channel = member.guild.channels.cache.get(config.welcomechannel[0].channel_id);
    const member = reaction.message.guild.members.cache.get(user.id);
    await member.roles.add('929494438038880306');
    channel.send(message);
}
