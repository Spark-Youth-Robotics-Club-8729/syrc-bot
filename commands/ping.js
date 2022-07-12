const { execute } = require("./ping");

module.exports = {
    name: 'ping',
    description: "this is a ping command!",
    execute(client, message, args) {
        const newEmbed = {
            color: '#5F75DE',
            title: "Pong! 🏓",
            fields: [
                { name: "Latency", value: `${Date.now() - message.createdTimestamp} ms`, inline: true },
                { name: "API Latency", value: `${Math.round(client.ws.ping)} ms`, inline: true }
            ]
        }
        message.channel.send({ embeds: [newEmbed] });
    }
}