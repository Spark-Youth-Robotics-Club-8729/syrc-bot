const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const Discord = require("discord.js")
const { pgClient } = require("../main");
const fs = require("fs");
const configData = require('../config.json');

module.exports = {
    ...new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configure the bot's settings")
        .addStringOption(option =>
            option
                .setName("action")
                .setDescription("what do you want to do")
                .setRequired(true)
                .addChoices(
                    { name: 'view', value: 'view' },
                    { name: 'add', value: 'add' },
                    { name: 'remove', value: 'remove' }
                )    
        )
        .addStringOption(option =>
            option
                .setName("setting")
                .setDescription("setting you want to change")
                .setRequired(true)
                .addChoices(
                    { name: 'modrole', value: 'modrole' },
                    { name: 'meetings-channel', value: 'meetingchannel' },
                    { name: 'bot-commands-channel', value: 'botcomchannel' },
                    { name: 'music-channel', value: 'musicchannel' },
                    { name: 'welcome-channel', value: 'welcomechannel' },
                    { name: 'counting-channel', value: 'countingchannel' },
                )
        )
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("the role value of the setting")
                .setRequired(false)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("the channel value of the setting")
                .setRequired(false)
        ),
    run: async (client, interaction, args) => {
        const target = interaction.guild.members.cache.get(interaction.user.id);
        if (target.permissions.has("ADMINISTRATOR")) {
            const action = interaction.options.getString("action");
            const setting = interaction.options.getString("setting");
            const role = interaction.options.getRole("role");
            const channel = interaction.options.getChannel("channel");
            let rawdata = fs.readFileSync('./config.json');
            let config = JSON.parse(rawdata);
            if (action == 'view') {
                await interaction.reply({ content: JSON.stringify(config[setting]) });
            } else if (action == 'add') {
                if (setting == 'modrole') {
                    try {
                        let temp = JSON.stringify(config.modrole);
                        config.modrole.push({"role_id": role.id});
                        let res = await pgClient.query(`SELECT * FROM modrole`);
                        console.log(res.rows);
                        await pgClient.query(`INSERT INTO modrole (role_id) VALUES ('${role.id}')`);
                        let res2 = await pgClient.query(`SELECT * FROM modrole`);
                        console.log(res2.rows);
                        await interaction.reply({ content: `Modrole changed from ${temp} to ${JSON.stringify(config.modrole)}` });
                    } catch {
                        await interaction.reply({ content: "A role argument is required" });
                    }
                } else if (setting == 'meetingchannel') {
                    try {
                        let temp = JSON.stringify(config.meetingchannel);
                        config.meetingchannel.push({"channel_id": channel.id});
                        let res = await pgClient.query(`SELECT * FROM meetingchannel`);
                        console.log(res.rows);
                        await pgClient.query(`INSERT INTO meetingchannel(channel_id) VALUES ('${channel.id}')`);
                        await interaction.reply({ content: `Meeting channel changed from ${temp} to ${JSON.stringify(config.meetingchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'botcomchannel') {
                    try {
                        let temp = JSON.stringify(config.botcomchannel);
                        config.botcomchannel.push({"channel_id": channel.id});
                        let res = await pgClient.query(`SELECT * FROM botcomchannel`);
                        console.log(res.rows);
                        await pgClient.query(`INSERT INTO botcomchannel(channel_id) VALUES ('${channel.id}')`);
                        await interaction.reply({ content: `Bot commands channel changed from ${temp} to ${JSON.stringify(config.botcomchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'musicchannel') {
                    try {
                        let temp = JSON.stringify(config.musicchannel);
                        config.musicchannel.push({"channel_id": channel.id});
                        let res = await pgClient.query(`SELECT * FROM musicchannel`);
                        console.log(res.rows);
                        await pgClient.query(`INSERT INTO botcomchannel(channel_id) VALUES ('${channel.id}')`);
                        await interaction.reply({ content: `Music channel changed from ${temp} to ${JSON.stringify(config.musicchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'welcomechannel') {
                    try {
                        let temp = JSON.stringify(config.welcomechannel);
                        config.welcomechannel.push({"channel_id": channel.id});
                        let res = await pgClient.query(`SELECT * FROM welcomechannel`);
                        console.log(res.rows);
                        await pgClient.query(`INSERT INTO welcomechannel(channel_id) VALUES ('${channel.id}')`);
                        await interaction.reply({ content: `Welcome channel changed from ${temp} to ${JSON.stringify(config.welcomechannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'countingchannel') {
                    try {
                        let temp = JSON.stringify(config.countingchannel);
                        config.countingchannel.push({"channel_id": channel.id});
                        let res = await pgClient.query(`SELECT * FROM countingchannel`);
                        console.log(res.rows);
                        await pgClient.query(`INSERT INTO countingchannel(channel_id) VALUES ('${channel.id}')`);
                        await interaction.reply({ content: `Counting channel changed from ${temp} to ${JSON.stringify(config.countingchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                }
                console.log("CONFIG");
                console.log(config);
                const configString = JSON.stringify(config);
                fs.writeFile('./config.json', configString, err => {
                    if (err) {
                        console.log('Error fetching data', err);
                    } else {
                        console.log('Successfully fetched data!');
                    }
                })
            } else if (action == 'remove') {
                if (setting == 'modrole') {
                    try {
                        let temp = JSON.stringify(config.modrole);
                        var i = config.modrole.length;
                        while (i--) {
                            if (config.modrole[i] == {"role_id": role.id}) {
                                config.modrole.splice(array.indexOf({"role_id": role.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM modrole WHERE role_id = '${role.id}'`);
                        await interaction.reply({ content: `Modrole changed from ${temp} to ${JSON.stringify(config.modrole)}` });
                    } catch {
                        await interaction.reply({ content: "A role argument is required" });
                    }
                } else if (setting == 'meetingchannel') {
                    try {
                        let temp = JSON.stringify(config.meetingchannel);
                        var i = config.meetingchannel.length;
                        while (i--) {
                            if (config.meetingchannel[i] == {"channel_id": channel.id}) {
                                config.meetingchannel.splice(array.indexOf({"channel_id": channel.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM meetingchannel WHERE channel_id = '${channel.id}'`);
                        await interaction.reply({ content: `Meeting channel changed from ${temp} to ${JSON.stringify(config.meetingchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'botcomchannel') {
                    try {
                        let temp = JSON.stringify(config.botcomchannel);
                        var i = config.botcomchannel.length;
                        while (i--) {
                            if (config.botcomchannel[i] == {"channel_id": channel.id}) {
                                config.botcomchannel.splice(array.indexOf({"channel_id": channel.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM botcomchannel WHERE channel_id = '${channel.id}'`);
                        await interaction.reply({ content: `Bot commands channel changed from ${temp} to ${JSON.stringify(config.botcomchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'musicchannel') {
                    try {
                        let temp = JSON.stringify(config.musicchannel);
                        var i = config.musicchannel.length;
                        while (i--) {
                            if (config.musicchannel[i] == {"channel_id": channel.id}) {
                                config.musicchannel.splice(array.indexOf({"channel_id": channel.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM musicchannel WHERE channel_id = '${channel.id}'`);
                        await interaction.reply({ content: `Music channel changed from ${temp} to ${JSON.stringify(config.musicchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'welcomechannel') {
                    try {
                        let temp = JSON.stringify(config.welcomechannel);
                        var i = config.welcomechannel.length;
                        while (i--) {
                            if (config.welcomechannel[i] == {"channel_id": channel.id}) {
                                config.welcomechannel.splice(array.indexOf({"channel_id": channel.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM welcomechannel WHERE channel_id = '${channel.id}'`);
                        await interaction.reply({ content: `Welcome channel changed from ${temp} to ${JSON.stringify(config.welcomechannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'countingchannel') {
                    try {
                        let temp = JSON.stringify(config.countingchannel);
                        var i = config.countingchannel.length;
                        while (i--) {
                            if (config.countingchannel[i] == {"channel_id": channel.id}) {
                                config.countingchannel.splice(array.indexOf({"channel_id": channel.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM countingchannel WHERE channel_id = '${channel.id}'`);
                        await interaction.reply({ content: `Counting channel changed from ${temp} to ${JSON.stringify(config.countingchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                }
                console.log(config);
                const configString = JSON.stringify(config);
                fs.writeFile('./config.json', configString, err => {
                    if (err) {
                        console.log('Error fetching data', err);
                    } else {
                        console.log('Successfully fetched data!');
                    }
                })
            }
        } else {
            await interaction.reply({ content: "Not cool enough, cry about it", ephemeral: true });
        }
    }
};