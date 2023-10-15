const { ActivityType } = require('discord.js');
const Discord = require('discord.js');
const db = require('quick.db');
const { prefix } = require('../config.json');
const { joinVoiceChannel } = require('@discordjs/voice');
const distube = require('../client/distube');
const { Utils } = require("devtools-ts");
const utilites = new Utils();

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    try {
      console.log((`Logged in as ${client.user.tag}`).red);
      console.log((`Servers: ${client.guilds.cache.size}`).magenta, (`Users: ${client.guilds.cache
        .reduce((a, b) => a + b.memberCount, 0)
        .toLocaleString()}`).yellow, (`Commands: ${client.commands.size}`).green);

      // Set bot's status and activity
      client.user.setPresence({
        status: "idle",
        activities: [
          {
            name: `𝘼 𝙈 𝟕 𝙊 𝙏`,
            type: ActivityType.Streaming,
            url: 'https://www.youtube.com/watch?v=bNyUyrR0PHo',
          },
        ],
      });

      setInterval(async () => {
        client.guilds.cache.forEach(async g => {
          let vch = await db.get(`24_7_${g.id}`);
          if (vch == null) return;
          let ch = client.channels.cache.get(vch);
          if (ch == null) return db.delete(`24_7_${g.id}`);
          const clientMember = g.members.cache.get(client.user.id);
          const checkJoined = clientMember?.voice?.channelId == ch.id;
          if (!checkJoined) {
            console.log(checkJoined);
            try {
              await distube.voices.join(ch);
            } catch (e) {
              console.log("connection", e);
            }
          }
        });
      }, 7000);
    } catch (err) {
      console.log(err);
    }
  },
};
