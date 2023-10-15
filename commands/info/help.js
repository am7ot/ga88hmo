const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const { prefix } = require('../../config.json');
const { Utils } = require("devtools-ts");
const utilities = new Utils();

// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "help",
    description: 'Feeling lost?',
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            // Check if the message author is a bot
            if (message.author.bot) {
                return; // Ignore commands from other bots
            }

            // Check if the user and bot are in the same voice channel
            const userVoiceChannel = message.member.voice.channel;

            if (userVoiceChannel && userVoiceChannel.id === botVoiceChannelId) {
                const globPromise = promisify(glob);
                const commandFiles = await globPromise(`${process.cwd()}/commands/music/**/*.js`);

                let embed = new EmbedBuilder()
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

                commandFiles.map((value) => {
                    const file = require(value);
                    const splitted = value.split("/");
                    const directory = splitted[splitted.length - 2];

                    if (file.name) {
                        const properties = { directory, ...file };
                        embed.addFields({ name: `${prefix}${properties.name}`, value: `${properties.description}`, inline: false });
                    }
                });

                let row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Invite Bot')
                            .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel('Server Support')
                            .setURL(`https://discord.gg/developer-tools`)
                    );

                // Send the help message as a DM to the user who issued the command
                message.author.send({ embeds: [embed], components: [row] });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
