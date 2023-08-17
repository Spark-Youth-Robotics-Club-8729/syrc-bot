const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require('axios');

module.exports = {
    ...new SlashCommandBuilder()
        .setName("weather")
        .setDescription("get weather data of a city")
        .addStringOption(option =>
            option
                .setName("place")
                .setDescription("City you want to get the weather of")
                .setRequired(true)
        ),
    run: async (client, interaction, _args) => {
        const weather_api_key = "046bc80be1c3e7a199f6995c46b6c94b";
        const loc = interaction.options.getString("place").replace(/\b\w/g, l => l.toUpperCase());
        try {
            let res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${weather_api_key}`);
            let weatherData = res.data;
            let newEmbed = {
                color: '#5F75DE',
                title: "Weather of " + loc,
                description: weatherData["weather"][0]["main"],
                fields: [
                    { name: "Temperature", value: (Math.round((weatherData["main"]["temp"] - 273.15)*10)/10).toString() + "°C", inline: true },
                    { name: "Daily High", value: (Math.round((weatherData["main"]["temp_max"] - 273.15)*10)/10).toString() + "°C", inline: true },
                    { name: "Daily Low", value: (Math.round((weatherData["main"]["temp_min"] - 273.15)*10)/10).toString() + "°C", inline: true },
                    { name: "Feels Like", value: (Math.round((weatherData["main"]["feels_like"] - 273.15)*10)/10).toString() + "°C", inline: true },
                    { name: "Humidity", value: weatherData["main"]["humidity"].toString() + "%", inline: true },
                    { name: "Wind Speed", value: weatherData["wind"]["speed"].toString() + " m/s", inline: true },
                ]
            }
            await interaction.reply({ embeds: [newEmbed] });
        } catch {
            const newEmbed = {
                color: '#5F75DE',
                description: "City not found :("
            }
            await interaction.reply({ embeds: [newEmbed] });
        }
    }
} 
