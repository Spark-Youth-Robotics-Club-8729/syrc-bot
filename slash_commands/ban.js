const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const fs = require("fs");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("ban")
        .setDescription("ban people xd")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Which user to be banned")
                .setRequired(true)
        ), run: async (client, interaction, args,) => {
            let rawdata = fs.readFileSync('./config.json');
            let config = JSON.parse(rawdata);
            let modroles = [];
            for (let i in config.modrole) {
                modroles.push(config.modrole[i].role_id);
            }
            if (interaction.member.roles.cache.some(role => modroles.includes(role.id))) {
                if (member) {
                    const memberTarget = interaction.guild.members.cache.get(member.id);
                    let reason = args.slice(1).join(" ");
                    if (!reason) reason = "No reason given";
                    if (memberTarget.kickable) {
                        const kickEmbed = new Discord.MessageEmbed()
                            .setTitle(`You were banned from ${interaction.guild.name}`)
                            .setDescription(`Reason: ${reason}`)
                            .setColor("#5F75DE")
                            .setTimestamp()
                            .setFooter(client.user.tag, client.user.displayAvatarURL());
                        try {
                            await memberTarget.send({ embeds: [kickEmbed] });
                        } catch (err) {
                            // pass
                        }
                        memberTarget.ban();
                        interaction.reply("User has been banned");
                    } else {
                        interaction.reply("Insufficient Permissions");
                    }
                } else {
                    interaction.reply('No member specified');
                }
            } else {
                interaction.reply("Lol you don't have perms to ban people");
            }
        }
}
