import {Message, SlashCommandBuilder} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with Pong!'),
    async execute(message: Message) {
        await message.channel.send('`Les commandes sont : \n?help : affiche cette réponse \n?bagarre : faire la bagarre contre le bot \n?bagarre @username : faire la bagarre contre la personne mentionnée \n?bagarre @username unTitre : expliquer pourquoi faire la bagarre \n?channelId : donne l\'id du channel \n?serverId : donne l\'id du serveur`');
    },
}