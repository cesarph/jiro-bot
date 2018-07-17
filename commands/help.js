const Discord = require('discord.js'),
      { prefix } = require('../config.json');

module.exports = {
	name: 'help',
    description: 'List all of my commands or info about a specific command.',
    usage:[{
            title: 'Showing all commands',
            examples: ['!help']
        },{
            title: 'Showing usage of a command',
            examples: ['!help <command name>']
        }

    ],
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
            embed.setAuthor(`${prefix}${command.name} Command Usage`, 'https://res.cloudinary.com/teepublic/image/private/s--hzenCVH3--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_630,q_90,w_630/v1467371704/production/designs/567364_1.jpg')
            
            if (command.description) embed.setDescription(`**Description:** ${command.description}\n\u200B`);
            if (command.aliases) embed.addField(`**Aliases:**`,`${command.aliases.join(', ')}\n\u200B` );
            if (command.usage) command.usage.map(usage => embed.addField(usage.title, usage.examples.join("\n")+"\n\u200B"));
        
        }
         
        return message.channel.send({ embed });


	},
};

