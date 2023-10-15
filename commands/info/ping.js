// Define the voice channel ID for the bot
const botVoiceChannelId = '1162589010015817820';

module.exports = {
    name: "ping",
    description: `Test the bot's response time.`,
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            // Check if the user and bot are in the same voice channel
            const userVoiceChannel = message.member.voice.channel;
            const botVoiceChannel = client.channels.cache.get(botVoiceChannelId);

            if (userVoiceChannel && botVoiceChannel && userVoiceChannel.id === botVoiceChannel.id) {
                message.reply({ content: `:ping_pong: Pong ${client.ws.ping} ms` });
            }
        } catch (err) {
            console.log(err);
        }
    },
};
