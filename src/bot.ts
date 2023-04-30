import * as fs from 'node:fs';
import * as path from 'node:path';
import {Client, Collection, Events, GatewayIntentBits, Interaction, Message} from 'discord.js';
import getClient from './client';
import * as dotenv from 'dotenv';
dotenv.config()

const client: Client = getClient();
const prefix: string = '?';

const commandsPath = path.join(__dirname, 'commands');

const messageCommandsPath = path.join(commandsPath, 'messages');
const messageCommands: Collection<any, any> = new Collection();
const messageCommandFiles = fs.readdirSync(messageCommandsPath).filter(file => file.endsWith('.js'));
for (const file of messageCommandFiles) {
    const filePath = path.join(messageCommandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        messageCommands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once('ready', () => {
    console.log('Discord bot started successfully');
});

client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase()[0] !== '?') return;
    const command = messageCommands.get(message.content.toLowerCase()?.substring(1));
    if (!command) return;
    try {
        await command.execute(message);
    } catch (error) {
        await message.channel.send('There were an error');
        console.log(error)
    }

})

const interactionCommandsPath = path.join(commandsPath, 'interactions');
const interactionCommands: Collection<any, any> = new Collection();
const interactionCommandFiles = fs.readdirSync(interactionCommandsPath).filter(file => file.endsWith('.js'));
for (const file of interactionCommandFiles) {
    const filePath = path.join(interactionCommandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        interactionCommands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
        const command = interactionCommands.get(interaction.commandName);
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

    // if (interaction.commandName === 'ask') {
    //     await interaction.reply({content: 'What is your question', ephemeral: true});
    // }
}
)
client.login(process.env.DISCORD_TOKEN).then(() => console.log('successfully logged-in'));
