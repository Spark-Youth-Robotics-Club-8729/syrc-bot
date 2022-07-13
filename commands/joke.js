const Discord = require("discord.js");
const axios = require('axios')
module.exports = {
    name: 'joke',
    description: "all commands of the bot",
    async execute(client, message, args, Discord) {
        // let arr = Object.values(jokes);
        // let joke = arr[Math.floor(Math.random() * arr.length)];
        // message.channel.send('Heres ur joke: ');
        let getJoke = async () => {
            let response = await axios.get('https://v2.jokeapi.dev/joke/Any?safe-mode');
            while (response.data.setup == undefined) {
                response = await axios.get('https://v2.jokeapi.dev/joke/Any?safe-mode');
            }
            let joke = response.data
            return joke
        }
        let jokeValue = await getJoke()
        console.log(jokeValue.setup);
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#5F75DE')
            .addFields(
                { name: jokeValue.setup, value: jokeValue.delivery, inline: true },
            )
        message.channel.send({ embeds: [newEmbed] });
    }
} 