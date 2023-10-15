const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "join",
    description: "Join the voice channel.",
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            // Check if the user and bot are in the same voice channel
            const userVoiceChannel = message.member.voice.channel;
            const botVoiceChannel = client.channels.cache.get(botVoiceChannelId);

            if (userVoiceChannel && botVoiceChannel && userVoiceChannel.id === botVoiceChannel.id) {
                const queue = distube.getQueue(message);
                if (queue) return message.reply({ content: `:no_entry_sign: I'm already in a voice channel!` });

                if (message.guild.members.me.voice?.channelId && userVoiceChannel.id !== message.guild.members.me?.voice?.channelId) {
                    return message.reply({ content: `:no_entry_sign: You must be listening in \`${message.guild.members.me?.voice?.channel.name}\` to use that!` });
                }

                if (!userVoiceChannel) {
                    return message.reply({ content: ":no_entry_sign: You must join a voice channel to use that!" });
                }

                distube.voices.join(userVoiceChannel);

                message.reply({ content: `:white_check_mark: Successfully joined \`${userVoiceChannel.name}\`!` });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
