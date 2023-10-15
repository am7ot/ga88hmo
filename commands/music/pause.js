const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { prefix } = require('../../config.json');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "pause",
    description: "Pauses the currently playing track.",
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            // Check if the user and bot are in the same voice channel
            const userVoiceChannel = message.member.voice.channel;
            const botVoiceChannel = client.channels.cache.get(botVoiceChannelId);

            if (userVoiceChannel && botVoiceChannel && userVoiceChannel.id === botVoiceChannel.id) {
                if (message.guild.members.me.voice?.channelId && userVoiceChannel.id !== message.guild.members.me?.voice?.channelId) {
                    return message.reply({ content: `:no_entry_sign: You must be listening in \`${message.guild.members.me?.voice?.channel.name}\` to use that!` });
                }
                if (!userVoiceChannel) {
                    return message.reply({ content: ":no_entry_sign: You must join a voice channel to use that!" });
                }
                const queue = distube.getQueue(message);
                if (!queue) {
                    return message.reply({ content: `:no_entry_sign: There must be music playing to use that!` });
                }
                const song = queue.songs[0];
                let name = song.name;
                if (queue.paused) {
                    message.reply({ content: `:no_entry_sign: **${name}** has been Paused!` });
                } else {
                    distube.pause(message);
                    message.reply({ content: `:notes: Paused **${name}** . Type \`${prefix}resume\` to unpause!` });
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
};
