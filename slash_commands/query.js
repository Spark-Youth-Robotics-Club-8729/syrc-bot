const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
// const mysql = require(`mysql2`);
const Discord = require("discord.js")
const { pgClient } = require("../main");

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
        const target = interaction.guild.members.cache.get(interaction.user.id);
        if (target.permissions.has("ADMINISTRATOR")) {
            const func = interaction.options.getString("function");
            if (func == "show_tables") {
                pgClient.query(`SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`, async (err, res) => {
                    if (!err) {
                        if (res.rows.length == 0) {
                            await interaction.reply({ content: "\`\`\`Empty response\`\`\`" });
                        } else {
                            await interaction.reply({ content: `\`\`\`${JSON.stringify(res.rows)}\`\`\`` });
                        }
                    } else {
                        console.log(err.message);
                        await interaction.reply({ content: `\`\`\`Error\`\`\`` });
                    }
                })
            } else if (func == "create_table") {
                await interaction.reply({ content: "Use custom for that merci bowcup" });
            } else if (func == "delete_table") {
                pgClient.query(`DROP TABLE ${interaction.options.getString("field1")}`, async (err, res) => {
                    if (!err) {
                        if (res.rows.length == 0) {
                            await interaction.reply({ content: "\`\`\`Empty response\`\`\`" });
                        } else {
                            await interaction.reply({ content: `\`\`\`${JSON.stringify(res.rows)}\`\`\`` });
                        }
                    } else {
                        console.log(err.message);
                        await interaction.reply({ content: `\`\`\`Error\`\`\`` });
                    }
                })
            } else if (func == "show_table") {
                pgClient.query(`SELECT * FROM ${interaction.options.getString("field1")}`, async (err, res) => {
                    if (!err) {
                        if (res.rows.length == 0) {
                            await interaction.reply({ content: "\`\`\`Empty response\`\`\`" });
                        } else {
                            await interaction.reply({ content: `\`\`\`${JSON.stringify(res.rows)}\`\`\`` });
                        }
                    } else {
                        console.log(err.message);
                        await interaction.reply({ content: `\`\`\`Error\`\`\`` });
                    }
                })
            } else if (func == "insert_value") {
                pgClient.query(`INSERT INTO ${interaction.options.getString("field1")} VALUES ('${interaction.options.getString("field2")}')`, async (err, res) => {
                    if (!err) {
                        if (res.rows.length == 0) {
                            await interaction.reply({ content: "\`\`\`Empty response\`\`\`" });
                        } else {
                            await interaction.reply({ content: `\`\`\`${JSON.stringify(res.rows)}\`\`\`` });
                        }
                    } else {
                        console.log(err.message);
                        await interaction.reply({ content: `\`\`\`Error\`\`\`` });
                    }
                })
            } else if (func == "update_value") {
                pgClient.query(`UPDATE ${interaction.options.getString("field1")} SET ${interaction.options.getString("field2")} = ('${interaction.options.getString("field3")}')`, async (err, res) => {
                    if (!err) {
                        if (res.rows.length == 0) {
                            await interaction.reply({ content: "\`\`\`Empty response\`\`\`" });
                        } else {
                            await interaction.reply({ content: `\`\`\`${JSON.stringify(res.rows)}\`\`\`` });
                        }
                    } else {
                        console.log(err.message);
                        await interaction.reply({ content: `\`\`\`Error\`\`\`` });
                    }
                })
            } else if (func == "delete_value") {
                pgClient.query(`DELETE FROM ${interaction.options.getString("field1")} WHERE ${interaction.options.getString("field2")} ='${interaction.options.getString("field3")}'`, async (err, res) => {
                    if (!err) {
                        if (res.rows.length == 0) {
                            await interaction.reply({ content: "\`\`\`Empty response\`\`\`" });
                        } else {
                            await interaction.reply({ content: `\`\`\`${JSON.stringify(res.rows)}\`\`\`` });
                        }
                    } else {
                        console.log(err.message);
                        await interaction.reply({ content: `\`\`\`Error\`\`\`` });
                    }
                })
            } else if (func == "custom") {
                pgClient.query(`${interaction.options.getString("field1")}`, async (err, res) => {
                    if (!err) {
                        if (res.rows.length == 0) {
                            await interaction.reply({ content: "\`\`\`Empty response\`\`\`" });
                        } else {
                            await interaction.reply({ content: `\`\`\`${JSON.stringify(res.rows)}\`\`\`` });
                        }
                    } else {
                        console.log(err.message);
                        await interaction.reply({ content: `\`\`\`Error\`\`\`` });
                    }
                })
            }
        } else {
            await interaction.reply({ content: "Not cool enough, cry about it", ephemeral: true });
        }
    }
};