const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const lyricsFinder = require("@jeve/lyrics-finder");
const { Utils } = require("devtools-ts");
const utilites = new Utils();

// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "lyrics",
    description: "Display lyrics of a song",
    cooldown: 5000,
    async execute(client, message) {
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
                let data;
                try {
                    data = await lyricsFinder.LyricsFinder(`${song.name}`);
                } catch {
                    data = false;
                }
                if (!data || !data?.trim) {
                    return message.reply({ content: `:rolling_eyes: No lyrics found for **${song.name}**` });
                }
                const messages = splitMessage(data, {
                    maxLength: 4000,
                    char: '\n',
                });
                for (const message of messages) {
                    message.reply({ content: message });
                }
            } 
        } catch (err) {
            console.log(err);
        }
    },
};

function verifyString(
    data,
    error = Error,
    errorMessage = `Expected a string, got ${data} instead.`,
    allowEmpty = true,
) {
    if (typeof data !== 'string') throw new error(errorMessage);
    if (!allowEmpty && data.length === 0) throw new error(errorMessage);
    return data;
}

function splitMessage(text, { maxLength = 1024, char = '\n', prepend = '', append = '' }) {
    text = verifyString(text);
    const splitText = text.split(char);
    const messages = [];
    let msg = '';
    for (const chunk of splitText) {
        if (msg && (msg + char + chunk + append).length > maxLength) {
            messages.push(msg + append);
            msg = prepend;
        }
        msg += (msg && msg !== prepend ? char : '') + chunk;
    }
    return messages.concat(msg).filter(m => m);
}
