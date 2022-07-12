const { execute } = require("./ping");
const Discord = require("discord.js");
const axios = require('axios')
module.exports = {
    name: 'weather',
    description: "get weather of a place",
    async execute(client, message, args, Discord) {
        const weather_api_key = "046bc80be1c3e7a199f6995c46b6c94b";
        const loc = args[0];
        let getWeather = async () => {
            let res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${weather_api_key}`);
            return res.data;
        }
        let weatherData = await getWeather();
        const newEmbed = {};
        if (weatherData["cod"] == 200) {
            newEmbed = {
                color: '#5F75DE',
                title: "Weather of " + loc.charAt(0).toUpperCase() + loc.slice(1),
                description: weatherData["weather"][0]["main"],
                fields: [
                    { name: "Temperature", value: (weatherData["main"]["temp"] - 273.15).toString(), inline: true },
                    { name: "Feels Like", value: (weatherData["main"]["feels_like"] - 273.15).toString(), inline: true },
                    { name: "Humidity", value: weatherData["main"]["humidity"].toString() + "%", inline: true },
                    { name: "Wind Speed", value: weatherData["wind"]["speed"].toString() + "m/s", inline: true },
                ]
            }
        } else {
            const newEmbed = {
                color: '#5F75DE',
                description: "City not found :("
            }
        }
        message.channel.send({ embeds: [newEmbed] });
    }
} 