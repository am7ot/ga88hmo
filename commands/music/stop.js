const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "stop",
    description: "Stop the current song and clear the entire music queue.",
    cooldown: 5000,
    aliases: ['st', 'ايقاف', 'وقف'],
    async execute(client, message, args) {
        try {
            // Get the user's voice channel
            const userVoiceChannel = message.member.voice.channel;

            // Check if the user is in a voice channel
            if (!userVoiceChannel) {
                return message.reply({ content: ":no_entry_sign: You must be in a voice channel to use that!" });
            }

            // Check if the bot is in a voice channel
            if (message.guild.members.me.voice?.channelId) {
                const botVoiceChannelId = message.guild.members.me.voice.channelId;

                // Check if the bot is in the same voice channel as the user
                if (userVoiceChannel.id === botVoiceChannelId) {
                    const queue = distube.getQueue(message);
                    if (!queue) {
                        return message.reply({ content: `:no_entry_sign: There must be music playing to use that!` });
                    }
                    message.reply({ content: `:notes: The player has stopped and the queue has been cleared.` });
                    return distube.stop(message);
                }
            } else {
                return message.reply({ content: ":no_entry_sign: The bot is not in a voice channel." });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
