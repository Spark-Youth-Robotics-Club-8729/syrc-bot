module.exports = async (Discord, client) => {
    console.log('Bot is online!');
    client.user.setPresence({
        status: "online",
        activities: [{
            name: "!help | SYRC",
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=8SIiGo3TVKE",
            details: "sparky :)"
        }]
    });
}
