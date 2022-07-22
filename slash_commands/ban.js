const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const mysql = require(`mysql2`);
const Discord = require("discord.js")


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
            const member = interaction.options.getUser("user");
            if (interaction.member.roles.cache.some(role => role.name === 'Lead')) {
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