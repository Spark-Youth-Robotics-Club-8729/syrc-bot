const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const stringSimilarity = require("string-similarity");
const Jimp = require("jimp");
const fs = require("fs");
const Discord = require('discord.js');
const { pgClient } = require("../main");

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
            if (wordcount === words.length) {
                break;
            }
        }
        return output;
    } else {
        output.push(text);
        return output;
    }
}

function store_typing_data(typinglb) {
    let rawdata = fs.readFileSync('./config.json');
    let config = JSON.parse(rawdata);
    config.typinglb = [];
    pgClient.query(`TRUNCATE TABLE typinglb`);
    for (let i = 0; i < typinglb.length; i++) {
        let score = typinglb[i];
        config.typinglb.push({"wpm": score["wpm"], "member_id": score["member_id"], "accuracy": score["accuracy"], "text": score["text"], "time": score["time"], "gross_wpm": score["gross_wpm"], "date": score["date"]});
        let text = score["text"].replaceAll("'", "''");
        console.log(text);
        pgClient.query(`INSERT INTO typinglb(wpm, member_id, accuracy, text, time, gross_wpm, date) VALUES ('${score["wpm"]}', '${score["member_id"]}', '${score["accuracy"]}', '${text}', '${score["time"]}', '${score["gross_wpm"]}', '${score["date"]}')`);
    }
    const configString = JSON.stringify(config);
    fs.writeFile('./config.json', configString, err => {
        if (err) {
            throw err;
        } else {
            console.log("STORED TYPING DATA");
        }
    })
}


async function addText(lines, index) {
    const image = await Jimp.read("assets/spooderman.jpg");
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    for (let i = 0; i < lines.length; i++) {
        image.print(font, 50, 150 + (i*36), lines[i]);
    }
    image.write(`output${index.toString()}.jpg`);
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = {
    ...new SlashCommandBuilder()
        .setName("typing")
        .setDescription("typing practice to warm up those fingies")
        .addStringOption(option => 
            option
                .setName("leaderboard")
                .setDescription("view the top scores of the server!")
                .setRequired(false)
                .addChoices(
                    { name: 'view', value: 'view_lb' },
                )
        ),
    run: async (client, interaction, _args) => {
        if (interaction.options.getString("leaderboard") === "view_lb") {
            pgClient.query(`SELECT * FROM typinglb`, async (err, res) => {
                if (!err) {
                    const typinglb = res.rows;
                    console.log("FETCHED TYPINGLB:");
                    console.log(typinglb);
                    if (typinglb.length === 0) {
                        let newEmbed = {
                            title: `SYRC's Typing Leaderboard`,
                            description: `*it's a bit empty in here at the moment... 🥺*`,
                            color: '#5F75DE',
                            timestamp: new Date(),
                            thumbnail: {
                                url: 'https://i.postimg.cc/dQjY2YNS/Screen-Shot-2022-03-07-at-9-00-41-PM.png',
                            },
                        }
                        await interaction.reply({ embeds: [newEmbed] });
                    } else {
                        let options = [];
                        for (let i = 0; i < typinglb.length; i++) {
                            console.log('hi im here')
                            try {
                                let user = await interaction.guild.members.fetch(typinglb[i]['member_id']);
                                options.push({
                                    label: typinglb[i]['wpm'].toString() + " wpm | " + user.user.username,
                                    value: (i+1).toString(),
                                    description: "View details"
                                })
                            } catch (DiscordAPIError) {
                                options.push({
                                    label: typinglb[i]['wpm'].toString() + " wpm | " + typinglb[i]['member_id'],
                                    value: (i+1).toString(),
                                    description: "View details"
                                })
                            }
                        }
                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('placement')
                                    .setPlaceholder('Choose a score to view details...')
                                    .addOptions(options)
                            )
                        let newEmbed = {
                            title: `SYRC's Typing Leaderboard`,
                            description: `Scores with the best speeds gets shown here!`,
                            color: '#5F75DE',
                            timestamp: new Date(),
                            fields: [],
                            thumbnail: {
                                url: 'https://i.postimg.cc/dQjY2YNS/Screen-Shot-2022-03-07-at-9-00-41-PM.png',
                            },
                        }
                        for (let i = 0; i < typinglb.length; i++) {
                            try {
                                let user = await interaction.guild.members.fetch(typinglb[i]['member_id']);
                                let details = "**Member: **" + user.user.username + "\n**Date: **" + typinglb[i]['date'];
                                newEmbed.fields.push({ name: "#" + (i+1).toString() + " - " + typinglb[i]['wpm'].toString() + " wpm", value: details, inline: false });
                            } catch (DiscordAPIError) {
                                let details = "**Member:** *" + typinglb[i]['member_id'] + "*\n**Date: **" + typinglb[i]['date'];
                                newEmbed.fields.push({ name: "#" + (i+1).toString() + " - " + typinglb[i]['wpm'].toString() + " wpm", value: details, inline: false });
                            }
                        }
                        await interaction.reply({ embeds: [newEmbed], components: [row] });
                    }
                } else {
                    throw err;
                }
            })
        } else {
            let rawtext = "";
            let index = 0;
            for (; index < 10; index++) {
                if (!fs.existsSync(`./output${index.toString()}.jpg`)) {
                    break;
                }
            }
            var index = 0;
            fs.readFile('./assets/texts.txt', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    const texts = data.split('|');
                    rawtext = texts[Math.floor(Math.random()*texts.length)];
                    console.log("TEXT:\n" + rawtext);
                    const lines = marginalize(rawtext, 33);
                    addText(lines, index);
                }
            });
            const embed = new Discord.MessageEmbed().setImage(`attachment://output${index.toString()}.jpg`).setTimestamp(new Date()).setColor('#5F75DE');
            const channel = interaction.channel;
            await interaction.reply({ content: "Type the following text as fast as you can!" });
            const msg = await channel.send(":white_circle::white_circle::white_circle:");
            await sleep(1000);
            await msg.edit(":red_circle::white_circle::white_circle:");
            await sleep(1000);
            await msg.edit(":red_circle::yellow_circle::white_circle:");
            await sleep(1000);
            await msg.edit(":red_circle::yellow_circle::green_circle:");
            await channel.send({ embeds: [embed], files: [`./output${index.toString()}.jpg`] });
            let startTime = new Date();
            await msg.delete();
            const collector = new Discord.MessageCollector(channel, m => m.author.id === interaction.member.user.id, { time: 10000 });
            collector.on('collect', async message => {
                if (message.author.id === interaction.member.user.id) {
                    let endTime = new Date();
                    let timeAllotted = (endTime - startTime)/1000;
                    let sim = stringSimilarity.compareTwoStrings(rawtext, message.content);
                    let coef = (message.content.length < rawtext.length) ? (message.content.length / rawtext.length) : (rawtext.length / message.content.length);
                    let accuracy = Math.round(sim*coef*100);
                    let words = rawtext.length / 5
                    let minutes = timeAllotted / 60;
                    let grosswpm = words / minutes;
                    let adjwpm = grosswpm * sim * coef;
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
                        description: `*"${rawtext}"*`,
                        color: colour,
                        timestamp: new Date(),
                        fields: [
                            { name: "Accuracy", value: accuracy.toFixed(2).toString() + "%" },
                            { name: "Word count", value: rawtext.split(' ').length.toString() },
                            { name: "Time taken", value: timeAllotted.toFixed(2).toString() + " seconds" },
                            { name: "Gross wpm", value: grosswpm.toFixed(2).toString() },
                        ]
                    }
                    await channel.send({ embeds: [newEmbed] });
                    pgClient.query(`SELECT * FROM typinglb`, async (err, res) => {
                        if (!err) {
                            let typinglb = res.rows;
                            typinglb.push({
                                "wpm": adjwpm.toFixed(2), 
                                "member_id": interaction.member.user.id.toString(), 
                                "accuracy": accuracy.toFixed(2).toString(),
                                "text": rawtext,
                                "time": timeAllotted.toFixed(2).toString(),
                                "gross_wpm": grosswpm.toFixed(2).toString(),
                                "date": new Date().toUTCString().substring(5)
                            })
                            typinglb = typinglb.sort(function(a, b) {
                                return parseInt(b['wpm']) - parseInt(a['wpm']);
                            });
                            let freq = {};
                            let position = 0;
                            for (; position < typinglb.length && position < 11; position++) {
                                if (!(typinglb[position].member_id in freq)) {
                                    freq[typinglb[position].member_id] = position;
                                } else {
                                    if (parseFloat(typinglb[position].wpm) < adjwpm.toFixed(2)) {
                                        let newEmbed = {
                                            title: `Your score took the #${freq[typinglb[position].member_id]+1} spot on the leaderboard! :tada:`,
                                            description: `Wow, good job! Do /typing leaderboard to see your score!`,
                                            color: '#5ecc71',
                                            timestamp: new Date()
                                        }
                                        await channel.send({ embeds: [newEmbed] })
                                    }
                                    typinglb.splice(position, 1);
                                    position -= 1;
                                    break;
                                }
                            }
                            typinglb.splice(11, typinglb.length - 11);
                            console.log(typinglb);
                            store_typing_data(typinglb);
                            collector.stop();
                        } else {
                            throw err;
                        }
                    })
                }
            })
            fs.unlinkSync(`./output${index.toString()}.jpg`);
        }
    }
};
