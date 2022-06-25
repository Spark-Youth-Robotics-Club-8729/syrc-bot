const { execute } = require("./ping");

module.exports = {
    name: 'ping',
    description: "this is a ping command!",
    execute(client, message, args) {
        message.channel.send('pong!');
    }
}