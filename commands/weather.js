const { execute } = require("./ping");
const Discord = require("discord.js");
const axios = require('axios');
module.exports = {
    name: 'weather',
    description: "get weather of a place",
    async execute(client, message, args, Discord) {
        const weather_api_key = "046bc80be1c3e7a199f6995c46b6c94b";
        const loc = args.join(' ').replace(/\b\w/g, l => l.toUpperCase());
        console.log(loc);
        try {
            let res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${weather_api_key}`);
            let weatherData = res.data;
            let newEmbed = {
                color: '#5F75DE',
                title: "Weather of " + loc.charAt(0).toUpperCase() + loc.slice(1),
                description: weatherData["weather"][0]["main"],
                fields: [
                    { name: "Temperature", value: (Math.round((weatherData["main"]["temp"] - 273.15)*10)/10).toString() + "°C", inline: true },
                    { name: "Feels Like", value: (Math.round((weatherData["main"]["feels_like"] - 273.15)*10)/10).toString() + "°C", inline: true },
                    { name: "Humidity", value: weatherData["main"]["humidity"].toString() + "%", inline: true },
                    { name: "Wind Speed", value: weatherData["wind"]["speed"].toString() + " m/s", inline: true },
                ]
            }
            message.channel.send({ embeds: [newEmbed] });
        } catch {
            const newEmbed = {
                color: '#5F75DE',
                description: "City not found :("
            }
            message.channel.send({ embeds: [newEmbed] });
        }
    }
} 