const fs = require("fs");

module.exports = (Discord, client, member) => {
    console.log("HI");
    
    let rawdata = fs.readFileSync('./config.json');
    let config = JSON.parse(rawdata);
    const rolechannel = member.guild.channels.cache.get(1000805634821869601);
    const linkschannel = member.guild.channels.cache.get(862089529698811934);
    const message = `Welcome <@${member.id}> to first robotics team 8729: Sparkling H2O! Check out ${<#1000805634821869601>} to get roles. And ${<#862089529698811934>} for useful links throughout your journey. Awesome to have you here :D`;
    const channel = member.guild.channels.cache.get(config.welcomechannel[0].channel_id);

    channel.send(message);
}
