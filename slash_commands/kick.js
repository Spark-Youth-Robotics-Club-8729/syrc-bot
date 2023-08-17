const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js")
const fs = require("fs");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("kick")
        .setDescription("we kicked a kid united")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Which user to be kicked")
                .setRequired(true)
        ), run: async (client, interaction, args,) => {
            let rawdata = fs.readFileSync('./config.json');
            let config = JSON.parse(rawdata);
            let modroles = [];
            for (let i in config.modrole) {
                modroles.push(config.modrole[i].role_id);
            }
            if (interaction.member.roles.cache.some(role => modroles.includes(role.id))) {
                const user = interaction.options.getUser("user");
                const memberTarget = interaction.guild.members.cache.get(user.id);
                let reason = args.slice(1).join(" ");
                if (!reason) reason = "No reason given";
                if (memberTarget.kickable) {
                    const kickEmbed = new Discord.MessageEmbed()
                        .setTitle(`You were kicked from ${interaction.guild.name}`)
                        .setDescription(`Reason: ${reason}`)
                        .setColor("#5F75DE")
                        .setTimestamp()
                        .setFooter(client.user.tag, client.user.displayAvatarURL());
                    try {
                        await memberTarget.send({ embeds: [kickEmbed] });
                    } catch (err) {
                        // pass
                    }
                    memberTarget.kick();
                    interaction.reply("User has been kicked");
                } else {
                    interaction.reply("Insufficient Permissions");
                }
            } else {
                interaction.reply("Lol you don't have perms to kick people");
            }
        }
}
