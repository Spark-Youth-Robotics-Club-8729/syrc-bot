const { execute } = require("./ping");

module.exports = {
    name: 'clear',
    description: "Clear messages!",
    async execute(client, message, args) {
        if (message.member.roles.cache.some(role => role.name === 'Lead')) {

            if (!args[0]) return message.reply("Please enter the number of messages you want to clear (between 1-100)");
            if (isNaN(args[0])) return message.reply("please enter a real number");

            if (args[0] > 100) return message.reply("You can not delete more than 100 messages");
            if (args[0] < 1) return message.reply("You must delete at least one message");

            await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
                message.channel.bulkDelete(messages);
                if (args[0] > 1) {
                    message.channel.send(String(args[0]) + " messages cleared.");
                } else {
                    message.channel.send("1 message cleared.")
                }


            });
        }
    }
}