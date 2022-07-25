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
                        await interaction.reply({ content: `Modroles changed from ${temp} to ${JSON.stringify(config.modrole)}` });
                    } catch {
                        await interaction.reply({ content: "A role argument is required" });
                    }
                } else if (setting == 'meetingchannel') {
                    try {
                        let temp = JSON.stringify(config.meetingchannel);
                        config.meetingchannel.push({"channel_id": channel.id});
                        await interaction.reply({ content: `Meeting channel changed from ${temp} to ${JSON.stringify(config.meetingchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'botcomchannel') {
                    try {
                        let temp = JSON.stringify(config.botcomchannel);
                        config.botcomchannel.push({"channel_id": channel.id});
                        await interaction.reply({ content: `Bot commands channel changed from ${temp} to ${JSON.stringify(config.botcomchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'musicchannel') {
                    try {
                        let temp = JSON.stringify(config.musicchannel);
                        config.musicchannel.push({"channel_id": channel.id});
                        await interaction.reply({ content: `Music channel changed from ${temp} to ${JSON.stringify(config.musicchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'welcomechannel') {
                    try {
                        let temp = JSON.stringify(config.welcomechannel);
                        config.welcomechannel.push({"channel_id": channel.id});
                        await interaction.reply({ content: `Welcome channel changed from ${temp} to ${JSON.stringify(config.welcomechannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'countingchannel') {
                    try {
                        let temp = JSON.stringify(config.countingchannel);
                        config.countingchannel.push({"channel_id": channel.id});
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
            } else if (action == 'remove') {
                if (setting == 'modrole') {
                    try {
                        let temp = JSON.stringify(config.modrole);
                        config.modrole.splice({"role_id": role.id}, 1);
                        await interaction.reply({ content: `Modrole changed from ${temp} to ${JSON.stringify(config.modrole)}` });
                    } catch {
                        await interaction.reply({ content: "A role argument is required" });
                    }
                } else if (setting == 'meetingchannel') {
                    try {
                        let temp = JSON.stringify(config.meetingchannel);
                        config.meetingchannel.splice({"channel_id": channel.id}, 1);
                        await interaction.reply({ content: `Meeting channel changed from ${temp} to ${JSON.stringify(config.meetingchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'botcomchannel') {
                    try {
                        let temp = JSON.stringify(config.botcomchannel);
                        config.botcomchannel.splice({"channel_id": channel.id}, 1);
                        await interaction.reply({ content: `Bot commands channel changed from ${temp} to ${JSON.stringify(config.botcomchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'musicchannel') {
                    try {
                        let temp = JSON.stringify(config.musicchannel);
                        config.musicchannel.splice({"channel_id": channel.id}, 1);
                        await interaction.reply({ content: `Music channel changed from ${temp} to ${JSON.stringify(config.musicchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'welcomechannel') {
                    try {
                        let temp = JSON.stringify(config.welcomechannel);
                        config.welcomechannel.splice({"channel_id": channel.id}, 1);
                        await interaction.reply({ content: `Welcome channel changed from ${temp} to ${JSON.stringify(config.welcomechannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'countingchannel') {
                    try {
                        let temp = JSON.stringify(config.countingchannel);
                        config.countingchannel.splice({"channel_id": channel.id}, 1);
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