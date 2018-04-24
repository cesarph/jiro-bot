const Discord = require('discord.js');

module.exports = {
	name: 'gear',
	description: 'Shows the gear of a player',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(`usage info`);
		}

		args2 = [172, 180, 250, 'sorceress', 'Darkceuss', 'Seivy', 61.017, 'April 23 2018', 'https://cdn.discordapp.com/attachments/406891228303720459/438133319327154177/unknown.png' ];
		const [ ap, aap, dp, toonClass, familyName, characterName, lvl, lastUpdated, imageURL ] = args2;

		const [ offhand ] = args;

		const embed = new Discord.RichEmbed()
			.setColor('DARK_RED')
			.setAuthor(`${message.author.username}'s gear`, message.author.avatarURL)
			.setThumbnail('https://i.imgur.com/wSTFkRM.png')
			.addField('Family', capitalizeFirstLetter(familyName), true)
			.addField('Character', capitalizeFirstLetter(characterName), true)
			.addField('Class', capitalizeFirstLetter(toonClass), true)
			.addField('Lvl', lvl, true)
			.addField('\u200B', `**${offhand} build**`.toUpperCase())
			.addField('\:dagger: **AP**', ap, true)
			.addField('\:crossed_swords: **Awakening AP**', aap, true)
			.addField('\:shield: **DP**', dp, true)
			.setImage(imageURL)
			.setFooter(`Last update ${lastUpdated}`, 'https://i.imgur.com/wSTFkRM.png');

		message.channel.send({ embed });

	},
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}