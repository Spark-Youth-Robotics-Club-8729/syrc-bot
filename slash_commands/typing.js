const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const stringSimilarity = require("string-similarity");
const Jimp = require("jimp");
const fs = require("fs");
const Discord = require('discord.js');

function marginalize(text, margin) {
    let output = [];
    if ((text.length) >= margin) {
        let words = text.split(' ');
        let wordcount = 0;
        while (true) {
            let line = "";
            while (wordcount < words.length) {
                if (line.length <= margin && (line.length + words[wordcount].length) <= margin) {
                    line += words[wordcount] + " ";
                    wordcount += 1;
                } else {
                    break;
                }
            }
            output.push(line);
            if (wordcount == words.length) {
                break;
            }
        }
        return output;
    } else {
        output.push(text);
        return output;
    }
}

async function addText(lines) {
    const image = await Jimp.read("assets/spooderman.jpg");
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    for (let i = 0; i < lines.length; i++) {
        image.print(font, 50, 150 + (i*36), lines[i]);
    }
    image.write("output.jpg");
};

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = {
    // channel, title, description - colour, footer, image url
    ...new SlashCommandBuilder()
        .setName("typing")
        .setDescription("typing practice to warm up those fingies"),
    run: async (client, interaction, args) => {
        let rawtext = "";
        fs.readFile('./assets/texts.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const texts = data.split('|');
                rawtext = texts[Math.floor(Math.random()*texts.length)];
                console.log("TEXT:\n" + rawtext);
                const lines = marginalize(rawtext, 33);
                addText(lines);
            }
        });
        const embed = new Discord.MessageEmbed().setImage('attachment://output.jpg').setTimestamp(new Date()).setColor('#5F75DE');
        interaction.followUp({ content: "Type the following text as fast as you can!" });
        const channel = interaction.channel;
        const msg = await channel.send(":white_circle::white_circle::white_circle:");
        await sleep(1000);
        await msg.edit(":red_circle::white_circle::white_circle:");
        await sleep(1000);
        await msg.edit(":red_circle::yellow_circle::white_circle:");
        await sleep(1000);
        await msg.edit(":red_circle::yellow_circle::green_circle:");
        await channel.send({ embeds: [embed], files: ['./output.jpg'] });
        let startTime = new Date();
        await msg.delete();
        const collector = new Discord.MessageCollector(channel, m => m.author.id === interaction.member.user.id, { time: 10000 });
        collector.on('collect', message => {
            if (message.author.id === interaction.member.user.id) {
                let endTime = new Date();
                let timeAllotted = (endTime - startTime)/1000;
                console.log(timeAllotted);
                let sim = stringSimilarity.compareTwoStrings(rawtext, message.content);
                let accuracy = Math.round(sim*100);
                let words = rawtext.length / 5
                let minutes = timeAllotted / 60;
                let grosswpm = words / minutes;
                let adjwpm = grosswpm * sim;
                let colour = 'c381fd'; // purple
                if (adjwpm < 50) { // red
                    colour = '#f2626b';
                } else if (adjwpm >= 50 && adjwpm < 70) { // orange
                    colour = '#feba4f';
                } else if (adjwpm >= 70 && adjwpm < 85) { // yellow
                    colour = '#ffea7f';
                } else if (adjwpm >= 85 && adjwpm < 100) { // lime
                    colour = '#89e077';
                } else if (adjwpm >= 100 && adjwpm < 115) { // cyan
                    colour = '#89f3f1';
                } else if (adjwpm >= 115 && adjwpm < 130) { // blue
                    colour = '#03a4e9';
                }
                let newEmbed = {
                    title: `You just typed ${adjwpm.toFixed(2)} WPM!`,
                    description: `*\"${rawtext}\"*`,
                    color: colour,
                    timestamp: new Date(),
                    fields: [
                        { name: "Accuracy", value: accuracy.toFixed(2).toString() + "%" },
                        { name: "Word count", value: rawtext.split(' ').length.toString() },
                        { name: "Time taken", value: timeAllotted.toFixed(2).toString() + " seconds" },
                        { name: "Gross wpm", value: grosswpm.toFixed(2).toString() },
                    ]
                }
                message.reply({ embeds: [newEmbed] });
            }
        })
        collector.on('end', collected => {
            console.log(`Finished execution`);
        });
    }
};