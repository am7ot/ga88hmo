const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { prefix } = require('../../config.json');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "seek",
    description: "Seeks to a certain point in the current track.",
    cooldown: 5000,
    aliases: ['تقديم'],
    async execute(client, message, args) {
        try {
            // Check if the bot is in the specified voice channel
            if (message.guild.members.me.voice?.channelId !== botVoiceChannelId) {
                return message.reply({ content: `:no_entry_sign: I'm not in the correct voice channel!` });
            }



            if (!queue) {
                return message.reply({ content: `:no_entry_sign: There must be music playing to use that!` });
            }

            const song = queue.songs[0];

            if (!queue.autoplay && queue.formattedCurrentTime <= song.formattedDuration) {
                return message.reply({ content: `:no_entry_sign:  Max formattedDuration: [${queue.formattedCurrentTime} / ${song.formattedDuration}]` });
            }

            if (!args[0]) {
                return message.reply(`:rolling_eyes: - Example \`${prefix}seek **1**\``);
            }

            message.reply({ content: `:notes: Seeked the song for \`${args[0]} seconds\`` });
            return distube.seek(message, Number(args[0]) * 1000);
        } catch (err) {
            console.log(err);
        }
    },
};
