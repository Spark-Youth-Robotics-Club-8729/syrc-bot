module.exports = async (Discord, client) => {
    console.log('Bot is online!');
    const guild = client.guilds.cache.get('974812609704501318');
    client.user.setPresence({
        status: "online",
        activities: [{
            name: `!help | Stalking ${guild.memberCount} humans`,
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=8SIiGo3TVKE",
            details: "sparky :D"
        }]
    });
}
