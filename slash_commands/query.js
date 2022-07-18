const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
// const mysql = require(`mysql2`);
const Discord = require("discord.js")
var pool = require('../main.js')

// const syrcdb = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '!',
//     database: `syrcbot`
// });

module.exports = {
    ...new SlashCommandBuilder()
        .setName("query")
        .setDescription("???")
        .addStringOption(option =>
            option
                .setName("function")
                .setDescription("???")
                .setRequired(true)
                .addChoices(
                    { name: 'テーブルを表示', value: 'show_tables' },
                    { name: 'テーブルを作成する', value: 'create_table' },
                    { name: 'テーブルを削除', value: 'delete_table' },
                    { name: '表を表示', value: 'show_table' },
                    { name: '値を挿入', value: 'insert_value' },
                    { name: '値を更新', value: 'update_value' },
                    { name: '値を削除', value: 'delete_value' },
                    { name: 'カスタム', value: 'custom' },
                )
        )
        .addStringOption(option =>
            option
                .setName("field1")
                .setDescription("???")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("field2")
                .setDescription("???")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("field3")
                .setDescription("???")
                .setRequired(false)
        ),
    run: async (client, interaction, args) => {
        console.log(pool)
        const target = interaction.guild.members.cache.get(interaction.user.id);
        if (target.permissions.has("ADMINISTRATOR")) {
            console.log("HI");
            const func = interaction.options.getString("function");
            pool.connect(async function (err, client) {
                if (err) {
                    console.log(err);
                } else {
                    if (func == "テーブルを表示") {
                        await interaction.reply({ content: client.query(`SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`) });
                    } else if (func == "テーブルを作成する") {
                        await interaction.reply({ content: client.query(`no`) });
                    } else if (func == "テーブルを削除") {
                        await interaction.reply({ content: client.query(`DROP TABLE ${interaction.options.getString("field1")}`) });
                    } else if (func == "表を表示") {
                        await interaction.reply({ content: client.query(`SELECT * FROM ${interaction.options.getString("field1")}'`) });
                    } else if (func == "値を挿入") {
                        await interaction.reply({ content: client.query(`INSERT INTO ${interaction.options.getString("field1")} VALUES ('${interaction.options.getString("field2")}')'`) });
                    } else if (func == "値を更新") {
                        await interaction.reply({ content: client.query(`UPDATE ${interaction.options.getString("field1")} SET ${interaction.options.getString("field2")} = ('${interaction.options.getString("field3")}')`) });
                    } else if (func == "値を削除") {
                        await interaction.reply({ content: client.query(`DELETE FROM ${interaction.options.getString("field1")} WHERE ${interaction.options.getString("field2")} ='${interaction.options.getString("field3")}'`) });
                    } else if (func == "カスタム") {
                        await interaction.reply({ content: client.query(`${interaction.options.getString("field1")}`) });
                    }
                }
            });
        } else {
            await interaction.reply({ content: "Not cool enough, cry about it", ephemeral: true });
        }
    }
};