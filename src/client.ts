const { Client, GatewayIntentBits } = require('discord.js');

export default () => {
    return new Client({intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ]});
}

