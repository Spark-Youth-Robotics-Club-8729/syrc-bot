const pgClient = require("../../main");

module.exports = async (Discord, client, interaction) => {
    if (interaction.isCommand()) {
        // await interaction.deferReply({ ephemeral: false }).catch(() => { });
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({ content: "An error has occured " });
        const args = [];
        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction, args);
    } else if (interaction.isSelectMenu()) {
        if (interaction.customId == "placement") {
            pgClient.query(`SELECT * FROM typinglb`, async (err, res) => {
                if (!err) {
                    var typinglb = res.rows;
                    let score = typinglb[parseInt(interaction.values)-1];
                    let user = client.users.cache.get(score['member_id']);
                    let newEmbed = {
                        title: "#" + interaction.values.toString() + " - " + score["wpm"] + " wpm",
                        description: `*\"${score["text"]}\"*`,
                        color: '#5F75DE',
                        timestamp: new Date(),
                        fields: [
                            { name: "Accuracy", value: score["accuracy"] + "%" },
                            { name: "Member", value: user.username },
                            { name: "Time taken", value: score["time"] + " seconds" },
                            { name: "Gross wpm", value: score["gross_wpm"] + " wpm" },
                            { name: "Date", value: score["date"] }
                        ]
                    }
                    await interaction.reply({ embeds: [newEmbed], ephemeral: true });
                } else {
                    throw err;
                }
            });
        }
    }
}