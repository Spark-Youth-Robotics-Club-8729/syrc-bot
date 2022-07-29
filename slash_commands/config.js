const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const Discord = require("discord.js")
const { pgClient } = require("../main");
const fs = require("fs");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("config")
        .setDescription("configure the bot's settings")
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
                    let temp = JSON.stringify(config.modrole);
                    try {
                        config.modrole.push({"role_id": role.id});
                    } catch {
                        return await interaction.reply({ content: "A role argument is required" });
                    }
                    try {
                        await pgClient.query(`INSERT INTO modrole (role_id) VALUES ('${role.id}')`);
                    } catch {
                        return await interaction.reply({ content: "Cannot insert into database (something on your end prob xd)" });
                    }
                    await interaction.reply({ content: `Modrole changed from ${temp} to ${JSON.stringify(config.modrole)}` });
                } else if (setting == 'meetingchannel') {
                    let temp = JSON.stringify(config.meetingchannel);
                    try {
                        config.meetingchannel.push({"channel_id": channel.id});
                    } catch {
                        return await interaction.reply({ content: "A channel argument is required" });
                    }
                    try {
                        await pgClient.query(`INSERT INTO meetingchannel (channel_id) VALUES ('${channel.id}')`);
                    } catch {
                        return await interaction.reply({ content: "Cannot insert into database (something on your end prob xd)" });
                    }
                    await interaction.reply({ content: `Meeting channel changed from ${temp} to ${JSON.stringify(config.meetingchannel)}` });
                } else if (setting == 'botcomchannel') {
                    let temp = JSON.stringify(config.botcomchannel);
                    try {
                        config.botcomchannel.push({"channel_id": channel.id});
                    } catch {
                        return await interaction.reply({ content: "A channel argument is required" });
                    }
                    try {
                        await pgClient.query(`INSERT INTO botcomchannel (channel_id) VALUES ('${channel.id}')`);
                    } catch {
                        return await interaction.reply({ content: "Cannot insert into database (something on your end prob xd)" });
                    }
                    await interaction.reply({ content: `Bot commands channel changed from ${temp} to ${JSON.stringify(config.botcomchannel)}` });
                } else if (setting == 'musicchannel') {
                    let temp = JSON.stringify(config.musicchannel);
                    try {
                        config.musicchannel.push({"channel_id": channel.id});
                    } catch {
                        return await interaction.reply({ content: "A channel argument is required" });
                    }
                    try {
                        await pgClient.query(`INSERT INTO musicchannel (channel_id) VALUES ('${channel.id}')`);
                    } catch {
                        return await interaction.reply({ content: "Cannot insert into database (something on your end prob xd)" });
                    }
                    await interaction.reply({ content: `Music channel changed from ${temp} to ${JSON.stringify(config.musicchannel)}` });
                } else if (setting == 'welcomechannel') {
                    let temp = JSON.stringify(config.welcomechannel);
                    try {
                        config.welcomechannel.push({"channel_id": channel.id});
                    } catch {
                        return await interaction.reply({ content: "A channel argument is required" });
                    }
                    try {
                        await pgClient.query(`INSERT INTO welcomechannel (channel_id) VALUES ('${channel.id}')`);
                    } catch {
                        return await interaction.reply({ content: "Cannot insert into database (something on your end prob xd)" });
                    }
                    await interaction.reply({ content: `Welcome channel changed from ${temp} to ${JSON.stringify(config.welcomechannel)}` });
                } else if (setting == 'countingchannel') {
                    let temp = JSON.stringify(config.countingchannel);
                    try {
                        config.countingchannel.push({"channel_id": channel.id});
                    } catch {
                        return await interaction.reply({ content: "A channel argument is required" });
                    }
                    try {
                        await pgClient.query(`INSERT INTO countingchannel (channel_id) VALUES ('${channel.id}')`);
                    } catch {
                        return await interaction.reply({ content: "Cannot insert into database (something on your end prob xd)" });
                    }
                    await interaction.reply({ content: `Counting channel changed from ${temp} to ${JSON.stringify(config.countingchannel)}` });
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
                                config.modrole.splice(config.modrole.indexOf({"role_id": role.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM modrole WHERE role_id = '${role.id}'`);
                        await interaction.reply({ content: `Modrole changed from ${temp} to ${JSON.stringify(config.modrole)}` });
                    } catch {
                        await interaction.reply({ content: "A role argument is required" });
                    }
                } else if (setting == 'meetingchannel') {
                    if (channel.type == 'voice') {
                        return await interaction.reply({ content: "Voice channel not allowed for this setting" });
                    }
                    try {
                        let temp = JSON.stringify(config.meetingchannel);
                        var i = config.meetingchannel.length;
                        while (i--) {
                            if (config.meetingchannel[i] == {"channel_id": channel.id}) {
                                config.meetingchannel.splice(config.meetingchannel.indexOf({"channel_id": channel.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM meetingchannel WHERE channel_id = '${channel.id}'`);
                        await interaction.reply({ content: `Meeting channel changed from ${temp} to ${JSON.stringify(config.meetingchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'botcomchannel') {
                    if (channel.type == 'voice') {
                        return await interaction.reply({ content: "Voice channel not allowed for this setting" });
                    }
                    try {
                        let temp = JSON.stringify(config.botcomchannel);
                        var i = config.botcomchannel.length;
                        while (i--) {
                            if (config.botcomchannel[i] == {"channel_id": channel.id}) {
                                config.botcomchannel.splice(config.botcomchannel.indexOf({"channel_id": channel.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM botcomchannel WHERE channel_id = '${channel.id}'`);
                        await interaction.reply({ content: `Bot commands channel changed from ${temp} to ${JSON.stringify(config.botcomchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'musicchannel') {
                    if (channel.type != 'voice') {
                        return await interaction.reply({ content: "Text channel not allowed for this setting" });
                    }
                    try {
                        let temp = JSON.stringify(config.musicchannel);
                        var i = config.musicchannel.length;
                        while (i--) {
                            if (config.musicchannel[i] == {"channel_id": channel.id}) {
                                config.musicchannel.splice(config.musicchannel.indexOf({"channel_id": channel.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM musicchannel WHERE channel_id = '${channel.id}'`);
                        await interaction.reply({ content: `Music channel changed from ${temp} to ${JSON.stringify(config.musicchannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'welcomechannel') {
                    if (channel.type == 'voice') {
                        return await interaction.reply({ content: "Voice channel not allowed for this setting" });
                    }
                    try {
                        let temp = JSON.stringify(config.welcomechannel);
                        var i = config.welcomechannel.length;
                        while (i--) {
                            if (config.welcomechannel[i] == {"channel_id": channel.id}) {
                                config.welcomechannel.splice(config.welcomechannel.indexOf({"channel_id": channel.id}), 1);
                            }
                        }
                        pgClient.query(`DELETE FROM welcomechannel WHERE channel_id = '${channel.id}'`);
                        await interaction.reply({ content: `Welcome channel changed from ${temp} to ${JSON.stringify(config.welcomechannel)}` });
                    } catch {
                        await interaction.reply({ content: "A channel argument is required" });
                    }
                } else if (setting == 'countingchannel') {
                    if (channel.type == 'voice') {
                        return await interaction.reply({ content: "Voice channel not allowed for this setting" });
                    }
                    try {
                        let temp = JSON.stringify(config.countingchannel);
                        var i = config.countingchannel.length;
                        while (i--) {
                            if (config.countingchannel[i] == {"channel_id": channel.id}) {
                                config.countingchannel.splice(config.countingchannel.indexOf({"channel_id": channel.id}), 1);
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