const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");
const distube = require('../../client/distube');
const ytsr = require("@distube/ytsr");
const { Utils } = require("devtools-ts");
const utilites = new Utils();

// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "search",
    description: "Search song and play music.",
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            // Check if the bot is in the specified voice channel
            if (message.guild.members.me.voice?.channelId !== botVoiceChannelId) {
                return message.reply({ content: `:no_entry_sign: I'm not in the correct voice channel!` });
            }





            const voiceChannel = message.member?.voice?.channel;

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("one")
                        .setEmoji("1️⃣")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("two")
                        .setEmoji("2️⃣")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("three")
                        .setEmoji("3️⃣")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("four")
                        .setEmoji("4️⃣")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("five")
                        .setEmoji("5️⃣")
                        .setStyle(ButtonStyle.Secondary)
                )

            const options = {
                member: message.member,
                textChannel: message.channel,
                message,
            }
            const string = args.slice(0).join(' ')
            if (!string) return message.reply(`:no_entry_sign: **Please include a query.**`)

            const res = await ytsr(string, { safeSearch: true, limit: 5 });

            let index = 1;
            const result = res.items.slice(0, 5).map(x => `**${index++}. [${x.name}](${x.url})**`).join("\n")

            const embed = new EmbedBuilder()
                .setDescription(result)
                .setFooter({ text: `Please respond within 30 seconds` })

            message.reply({ content: "", embeds: [embed], components: [row] }).then((msg) => {
                const filter = i => i.user.id === message.author.id;

                const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, max: 1 });
                collector.on('collect', async (message) => {
                    const id = message.customId;
                    if (message.customId === "one") {
                        await msg.delete({ embeds: [], components: [] });
                        await distube.play(message.member.voice.channel, res.items[0].url, options).then(() => {
                        })
                    } else if (id === "two") {
                        await msg.delete({ embeds: [], components: [] });
                        await distube.play(message.member.voice.channel, res.items[1].url, options).then(() => {
                        })
                    } else if (id === "three") {
                        await msg.delete({ embeds: [], components: [] })
                        await distube.play(message.member.voice.channel, res.items[2].url, options).then(() => {
                        })
                    } else if (id === "four") {
                        await msg.delete({ embeds: [], components: [] });
                        await distube.play(message.member.voice.channel, res.items[3].url, options).then(() => {
                        })
                    } else if (id === "five") {
                        await msg.delete({ embeds: [], components: [] });
                        await distube.play(message.member.voice.channel, res.items[4].url, options).then(() => {
                        })
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === "time") {
                        msg.delete({ content: ``, embeds: [], components: [] });
                    }
                });
            })
        } catch (err) {
            console.log(err)
        }
    }
}
