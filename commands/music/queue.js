const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "queue",
    description: "Display the queue of the current tracks in the playlist.",
    cooldown: 5000,
    aliases: ['انتظار'],
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

                const reload = new ButtonBuilder()
                    .setCustomId('reload')
                    .setStyle(ButtonStyle.Primary)
                    .setLabel('🔄');
                const next = new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('➡️')
                    .setStyle(ButtonStyle.Primary);
                if (queue.songs.length === 1) next.setDisabled(true);

                const back = new ButtonBuilder()
                    .setCustomId('back')
                    .setLabel('⬅️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true);
                const row = new ActionRowBuilder()
                    .addComponents(back, reload, next);

                const exampleEmbed = new EmbedBuilder()
                    .setTitle(queue.songs[0].name)
                    .setURL(queue.songs[0].url)
                    .addFields(
                        { name: 'Time', value: queue.songs[0].formattedDuration, inline: true },
                        { name: 'Views', value: queue.songs[0].views + ' view', inline: true },
                        { name: 'Likes', value: queue.songs[0].likes + ' like', inline: true },
                    )
                    .setImage(queue.songs[0].thumbnail)
                    .setTimestamp()
                    .setFooter({ text: `1 / ${queue.songs.length}` });

                return message.reply({
                    embeds: [exampleEmbed],
                    components: [row]
                });
            } 
        } catch (err) {
            console.log(err);
        }
    },
};
