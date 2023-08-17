const fs = require("fs");

module.exports = {
    name: 'beemovie',
    description: "agagaga",
    execute(client, message, _args, _Discord) {
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
        setInterval (function () {
            message.channel.send(lines[cnt]).catch(console.error);
            cnt += 1;
        }, 1 * 10000); 
    }
}
