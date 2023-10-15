const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube');
const db = require(`quick.db`);
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "volume",
    description: "Changes/Shows the current volume.",
    cooldown: 5000,
    aliases: ['vol'],
    async execute(client, message, args) {
        try {
            // Check if the bot is in the same voice channel as the user
            if (message.guild.members.me.voice?.channelId !== message.member.voice.channelId) {
                return message.reply({ content: `` });
            }

            if (!message.member.voice.channel) {
                return message.reply({ content: ":no_entry_sign: You must join a voice channel to use that!" });
            }

            const queue = distube.getQueue(message);

            if (!queue) {
                return message.reply({ content: `:no_entry_sign: There must be music playing to use that!` });
            }

            const volume = parseInt(args[0]);

            if (!volume) {
                return message.reply({ content: `:loud_sound: Volume: \`${queue.volume}\`%` });
            }

            if (isNaN(volume) || volume < 0 || volume > 150) {
                return message.reply({ content: ':no_entry_sign: Please enter a valid number between 0 and 150' });
            }

            db.set(`volume_${message.guild.id}`, volume);
            message.reply(`:loud_sound: Volume changed from \`${queue.volume}\` to \`${volume}\``);
            distube.setVolume(message, volume);
        } catch (err) {
            console.log(err);
        }
    },
};
