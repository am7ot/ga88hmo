const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "jump",
    description: "Skip to a song in the queue.",
    cooldown: 5000,
    aliases: ['skipto'],
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
                if (!queue) return message.reply({ content: `:no_entry_sign: There must be music playing to use that!` });
                if (!queue.autoplay && queue.songs.length <= 1) return message.reply({ content: `:no_entry_sign: This is the last song in the queue.` });

                if (0 <= Number(args[0]) && Number(args[0]) <= queue.songs.length) {
                    message.reply({ content: `:notes: Jumped songs!` });
                    return distube.jump(message, parseInt(args[0]))
                        .catch(err => message.reply({ content: `:no_entry_sign: Invalid song number.` }));
                } else {
                    message.reply({ content: `:no_entry_sign: Please use a number between **0** and **${queue.songs.length}**` });
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
};
