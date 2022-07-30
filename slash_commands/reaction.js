const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const Discord = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const { pgClient } = require("../main");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("reactionrole")
        .setDescription("creates a reaction role menu to obtain certain roles")
        .addStringOption(option =>
            option
                .setName("mode")
                .setDescription("Select a mode")
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'delete', value: 'delete' },
                    { name: 'list', value: 'list' },
                )
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription('Set the channel where you want to send a message to')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("Set the title of the reaction role menu")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("Set the description of the reaction role menu")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Message ID of the reaction role you want to delete")
                .setRequired(false)
        ),
    run: async (client, interaction, args) => {
        let rawdata = fs.readFileSync('./config.json');
        let config = JSON.parse(rawdata);
        let modroles = [];
        for (i in config.modrole) {
            modroles.push(config.modrole[i].role_id);
        }
        if (interaction.member.roles.cache.some(role => modroles.includes(role.id))) {

            const interactionChannel = interaction.channel;
            const mode = interaction.options.getString("mode");
            const channel = interaction.options.getChannel("channel");
            const title = interaction.options.getString("title");
            const description = interaction.options.getString("description");
            const msgID = interaction.options.getString("message");
            let rawdata = fs.readFileSync('./config.json');
            let config = JSON.parse(rawdata);

            if (mode == "add") {
                const collector = new Discord.MessageCollector(channel, m => m.author.id === interaction.member.user.id, { time: 10000 });
                let newEmbed = {
                    title: "Reaction Role Creator",
                    description: `**Send an emoji and a role to be added to the menu in the format <emoji> <role> (\"-\" to finish)**\n*empty*`,
                    color: '#5F75DE',
                }
                await interaction.reply({ content: "Beginning reaction role creation process...", ephemeral: true });
                let menuMsg = await interactionChannel.send({ embeds: [newEmbed] });
                var roles = [];
                var rolefields = [];
                let descriptionMsg = "Send an emoji and a role to be added to the menu in the format <emoji> <roleid> (\"-\" to finish)";
                collector.on('collect', async message => {
                    if (message.author.id === interaction.member.user.id) {
                        if (message.content == '-') {
                            await message.react("✅");
                            collector.stop();
                        } else {
                            let msgSplit = message.content.split(' ');
                            let role = message.guild.roles.cache.find(role => role.id === msgSplit[1]);
                            roles.push({ "emoji": msgSplit[0], "role": role });
                            rolefields.push({ name: msgSplit[0], value: "<@&" + role.id + ">", inline: true });
                            let newEmbed = {
                                title: "Reaction Role Creator",
                                description: descriptionMsg,
                                color: '#5F75DE',
                                fields: rolefields,
                            }
                            await menuMsg.edit({ embeds: [newEmbed] });
                        }
                    }
                })
                collector.on('end', async (collected, reason) => {
                    if (roles.length == 0) {
                        return await interaction.channel.send({ content: "Please enter at least 1 reaction role", ephemeral: true });
                    }
                    let reactionEmbed = {
                        title: title,
                        description: description,
                        color: '#5F75DE',
                        fields: rolefields,
                        timestamp: new Date()
                    }
                    let reactionMsg = await channel.send({ embeds: [reactionEmbed] });
                    for (i in roles) {
                        config.reaction.push({ "message_id": reactionMsg.id, "channel_id": channel.id, "emoji_id": roles[i]["emoji"], "role_id": roles[i]["role"].id });
                        pgClient.query(`INSERT INTO reaction (message_id, channel_id, emoji_id, role_id) VALUES ('${reactionMsg.id}', '${channel.id}', '${roles[i].emoji}', '${roles[i].role.id}')`);
                        await reactionMsg.react(roles[i]["emoji"]);
                    }
                    const configString = JSON.stringify(config);
                    fs.writeFile('./config.json', configString, err => {
                        if (err) {
                            console.log('Error storing data', err);
                        } else {
                            console.log('Successfully stored data!');
                        }
                    })
                    console.log(config.reaction);
                })
            } else if (mode == "delete") {
                let exists = false;
                let channelID = '';
                for (i in config.reaction) {
                    if (msgID == config.reaction[i].message_id) {
                        channelID = config.reaction[i].channel_id;
                        exists = true;
                        break;
                    }
                }
                if (exists) {
                    pgClient.query(`DELETE FROM reaction WHERE message_id = '${msgID}'`);
                    let table = await pgClient.query(`SELECT * FROM reaction`);
                    console.log(table.rows);
                    config.reaction = table.rows;
                    const configString = JSON.stringify(config);
                    fs.writeFile('./config.json', configString, err => {
                        if (err) {
                            console.log('Error fetching data', err);
                        } else {
                            console.log('Successfully fetched data!');
                        }
                    })
                } else {
                    return interaction.reply({ content: 'Please enter a valid reaction role message ID and try again' });
                }
            } else if (mode == "list") {
                var messages = {};
                for (i in config.reaction) {
                    messages[config.reaction[i].message_id] = config.reaction[i].channel_id;
                }
                let description = '';
                if (Object.keys(config.reaction).length == 0) {
                    description = '*None*';
                } else {
                    for (key in messages) {
                        description += `**https://discord.com/channels/${interaction.guild.id}/${messages[key]}/${key}**\n\n`
                    };
                }
                let newEmbed = {
                    title: "Reaction Role List",
                    description: description,
                    color: '#5F75DE',
                    timestamp: new Date()
                }
                await interaction.reply({ embeds: [newEmbed] });
            }
        } else {
            interaction.followUp("Insufficient Permissions");
        }
    }
};