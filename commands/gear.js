const Discord = require('discord.js'),
	  MongoClient = require('mongodb').MongoClient,
	  assert = require('assert')
	
require('dotenv').config();

const urlDB = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

module.exports = {
	name: 'gear',
	description: 'Shows the gear of a player',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(`usage info`);
		}

		let [ name ] = args;

		name = name.toLowerCase();
		

		(async function () {
            let client;

            try {
                client = await MongoClient.connect(urlDB);
                console.log("Connected correctly to server");

				const db = client.db(process.env.DB_DATABASE);
				
				const query = { $or: [ { "family": name }, { "char": name }, { "tag": name } ]};
				console.log(name);
				r = await db.collection('gear').findOne(query);

				const embed = new Discord.RichEmbed()
					.setColor('DARK_RED')
					.setAuthor(`Gear`, 'https://res.cloudinary.com/teepublic/image/private/s--hzenCVH3--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_630,q_90,w_630/v1467371704/production/designs/567364_1.jpg')
					.addField('Family', (r.family) ? capitalizeFirstLetter(r.family) : '?', true)
					.addField('Character', (r.char) ? capitalizeFirstLetter(r.char) : '?', true)
					.addField('Class', (r.class) ? capitalizeFirstLetter(r.class) : '?', true)
					.addField('Lvl', (r.lvl) ? r.lvl : '?', true)
					.addBlankField()
					.addField('**AP**', r.gear.ap, true)
					.addField('**Awakening AP**', r.gear.aap, true)
					.addField('**DP**', r.gear.dp, true)
					.addField('Renown Score', r.gear.score, true)
					.setImage(r.gear.gearURL)
					.setFooter(`Last update `, 'https://i.imgur.com/wSTFkRM.png');

				message.channel.send({ embed });

            } catch (err) {
                console.log(err.stack);
            }

            client.close();
        })();

	},
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}