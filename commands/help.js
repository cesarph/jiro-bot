const Discord = require('discord.js'),
	  MongoClient = require('mongodb').MongoClient,
      assert = require('assert'),
      { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	execute(message, args) {
        const { commands } = message.client;

		let embed = new Discord.RichEmbed().setColor('DARK_RED');
                
		if (!args.length) {
            embed.setTitle('Here\'s a list of all my commands:');
            embed.setDescription(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            commands.map(command => embed.addField(`${prefix}${command.name}`, command.description));
            
        } else {
            if (!commands.has(args[0])) {
                return message.reply('that\'s not a valid command!');
            }

            const command = commands.get(args[0]);
            
            if (command.usage) embed = command.usage["embed"];
            
            if (command.description) embed.setDescription(`**Description:** ${command.description}`);
            if (command.aliases) embed.setTitle(`**Aliases:**`,`${command.aliases.join(', ')}` );
            
        }
        
        return message.channel.send({ embed });


	},
};

