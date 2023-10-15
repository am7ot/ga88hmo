const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "nowplaying",
    description: "Shows what is song that the bot is currently playing.",
    cooldown: 5000,
    aliases: ['الان', 'np', 'status'],
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
                const uni = `${song.playing ? ':notes: | ' : ':notes: | '}`;
                const part = Math.floor((queue.currentTime / song.duration) * 30);
                let embed = new EmbedBuilder()
                    .setTitle(`${song.name}`)
                    .setURL(`${song.url}`)
                    .setDescription(`\nCurrent Duration: \`[${queue.formattedCurrentTime}/${song.formattedDuration}]\`\n${uni}${'▇'.repeat(part) + '▇' + '—'.repeat(24 - part)}`)
                    .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
                    .setFooter({ text: `@ ${song.uploader.name} | Views: ${song.views} | Like: ${song.likes}` });
                message.reply({ embeds: [embed] });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
