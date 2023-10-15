const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const { joinVoiceChannel } = require('@discordjs/voice');
const { Utils } = require("devtools-ts");
const utilites = new Utils();
const db = require(`quick.db`);

// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "247",
    description: "Toggles the 24/7 mode. This makes the bot doesn't leave the voice channel until you stop it.",
    cooldown: 5000,
    aliases: ['24/7', '24-7'],
    async execute(client, message, args) {
        try {
            // Check if the user and bot are in the same voice channel
            const userVoiceChannel = message.member.voice.channel;
            const botVoiceChannel = client.channels.cache.get(botVoiceChannelId);

            if (userVoiceChannel && botVoiceChannel && userVoiceChannel.id === botVoiceChannel.id) {
                if (message.guild.members.me.voice?.channelId && message.member.voice.channelId !== message.guild.members.me?.voice?.channelId) {
                    return message.reply({ content: `:no_entry_sign: You must be listening in \`${message.guild.members.me?.voice?.channel.name}\` to use that!` });
                }

                let channel = message.member.voice.channel;
                if (!channel) return message.reply({ content: ":no_entry_sign: You must join a voice channel to use that!" });

                distube.voices.join(channel).then(() => {
                    if (!db.get(`24_7_${message.guild.id}`)) {
                        db.set(`24_7_${message.guild.id}`, channel.id);
                        message.reply({ content: `:white_check_mark: Successfully enabled the 24/7!` });
                    } else {
                        db.delete(`24_7_${message.guild.id}`);
                        message.reply({ content: `:white_check_mark: Successfully disabled the 24/7!` });
                    }
                });
            } 
        } catch (err) {
            console.log(err);
        }
    },
};
