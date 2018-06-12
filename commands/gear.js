const Discord = require('discord.js'),
	  MongoClient = require('mongodb').MongoClient,
	  assert = require('assert')
	
require('dotenv').config();

const urlDB = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

module.exports = {
	name: 'gear',
	description: 'Shows/adds/updates the gear of a player',
	usage: [{
		title: "Showing Own Gear:",
		examples: ['!gear']
	},{
		title: "Showing Gear:",
		examples: ['!gear <@Name>','e.g. !gear @Darkceuss']
	},{
		title: "Updating/Adding Gear: ",
		examples: ['!gear <AP/AAP/DP> <imageURL>', '!gear <AP> <AAP> <DP> <imageURL>', 'e.g. !gear 178/180/230 https://i.gyazo.com/c081e197f6052b9d3abe466be87ef152.png']
	}],
	execute(message, args) {
		let name, gearscore, ap, aap, dp, offhand, gearURL, showGear = false, ownGearError = false;

        if (!args.length) {
            name = `<@${message.author.id.toLowerCase()}>`;
			showGear = true;
			ownGearError = true;

        } else if (args.length === 1) {
            [ name ] = args;
			name = name.toLowerCase();
			showGear = true;
			if (name.indexOf('@') < 1) 
				return message.channel.send("It seems that you didn't mention anyone! Try !gear @Darkceuss");

        } else if (args.length === 2) {
			[ gearscore, gearURL ] = args;
			[ ap, aap, dp ] = gearscore.split(/\/+/);

        } else if (args.length === 4) {
            [ ap, aap, dp, gearURL ] = args;

        } else {
			message.channel.send(`It seems you used the command wrongly! Use **!help gear** for more information`);
			return message.channel.send(usageInfo());
		}
		
		if (gearURL) {
			if (!gearURL.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g)) 
				return message.channel.send("The URL of your img is wrong! It needs to end in one of the following formats: png, jpg or gif");
		}
		if (gearscore) {
			if (!gearscore.match(/^[0-9]{1,3}\/[0-9]{1,3}\/[0-9]{1,3}\b/g))
				return message.channel.send("The format of your gears core is wrong! It needs to be as follows: AP/AAP/DP");
		}

		(async function () {	
            let client;

            try {
                client = await MongoClient.connect(urlDB);
                console.log("Connected correctly to server");

				const db = client.db(process.env.DB_DATABASE);
				let r;

				if (showGear) {
					const query = { $or: [ { "tag": name }, { "alt-tag": name } ] };
					
					try {
						r = await db.collection('gear').findOne(query);

						const embed = new Discord.RichEmbed()
							.setColor('DARK_RED')
							.setAuthor(`${r.name}'s Gear`, 'https://res.cloudinary.com/teepublic/image/private/s--hzenCVH3--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_630,q_90,w_630/v1467371704/production/designs/567364_1.jpg')
							.setThumbnail('https://res.cloudinary.com/teepublic/image/private/s--hzenCVH3--/t_Preview/b_rgb:191919,c_limit,f_jpg,h_630,q_90,w_630/v1467371704/production/designs/567364_1.jpg')
							.addField('**AP**', r.gear.ap, true)
							.addField('**Awakening AP**', r.gear.aap, true)
							.addField('**DP**', r.gear.dp, true)
							.addField('Renown Score', r.gear.score, true)
							.setImage(r.gear.gearURL)
							.setFooter(`Last update ${new Date(r.timestamp).toUTCString()}`, '');

						message.channel.send({ embed });

					} catch (err) {
						if (ownGearError) {
							message.channel.send(`Please set up your gear!`);
							return message.channel.send(usageInfo());
						} else {
							return message.channel.send(`Sorry! I couldn't find anyone with that name`);
						}
					}
					

				} else {
					const query = { "id": message.author.id };
                    const updatedDoc = {
                        $set: {
							"name":message.author.lastMessage.member.nickname,
							"id": message.author.id.toLowerCase(),
							"tag": `<@${message.author.id.toLowerCase()}>`,
							"alt-tag": `<@!${message.author.id.toLowerCase()}>`,
                            "gear": {
                                "ap": ap,
                                "aap": aap,
                                "dp": dp,
                                "gearURL": gearURL,
                                "score": Math.floor((Number(ap) + Number(aap))/2 + Number(dp))
							},
							"timestamp": Date.now()
                        }
                    };
					try {
						r = await db.collection('gear').updateOne(query, updatedDoc, { upsert: true });

						if (!r.upsertedCount) return message.channel.send(`Your gear has been updated succesfully!`);
						return message.channel.send(`Your gear has been added succesfully!`);

					} catch (err) {
						return message.channel.send(`Oops! Something went wrong, try again!`);
					}
                     
				}
            } catch (err) {
				return message.channel.send(`There was an error connecting to the database!`);
            }

            client.close();
        })();

	},
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}