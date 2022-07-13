const Discord = require("discord.js")
const fs = require("fs");

module.exports = {
    name: 'beemovie',
    description: "agagaga",
    execute(client, message, args, Discord) {
        let lines = [];
        fs.readFile('./assets/beemovie.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                lines = data.split('\n');
            }
        });
        let cnt = 0;
        console.log("SHEEESH");
        var interval = setInterval (function () {
            // use the message's channel (TextChannel) to send a new message
            message.channel.send(lines[cnt]).catch(console.error);
            cnt += 1;
        }, 1 * 10000); 
    }
}