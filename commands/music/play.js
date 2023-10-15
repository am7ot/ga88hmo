const { EmbedBuilder } = require("discord.js");
const distube = require('../../client/distube')
const wait = require('node:timers/promises').setTimeout;
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
    name: "play",
    description: "Add a song to queue and plays it.",
    cooldown: 5000,
    aliases: ['p', 'ش', 'شغل'],
    async execute(client, message, args) {
        try {
          let player = args.slice(0).join(' ')
            if (!player) return message.reply({ content: `:no_entry_sign: You should type song name or url.` })


            
            const voiceChannel = message.member?.voice?.channel;
            if (voiceChannel) {
                await distube.play(voiceChannel, player, {
                    message,
                    textChannel: message.channel,
                    member: message.member,
                });
            }
        } catch (err) {
            console.log(err)
        }
    },
};

