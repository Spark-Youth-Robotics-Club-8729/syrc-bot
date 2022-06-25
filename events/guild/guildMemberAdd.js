module.exports = (Discord, client, guildMember) => {

    const channelId = '990272152584462426';
    const targetChannelId = '985690065583898694';

    const message = `Welcome <@${member.id}> to the server! Check out ${member.guild.channels.cache.get(targetChannelId).toString()} for general on the server. (This message will be changed when we migrate to the SYRC server)`;

    const channel = member.guild.channels.cache.get(channelId);

    channel.send(message);
}


