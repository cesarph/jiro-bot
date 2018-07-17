const Discord = require('discord.js'),
	  MongoClient = require('mongodb').MongoClient,
	  { gearEmbed, extractID } = require('../helper');
	
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
		let id = message.author.id, gearscore, ap, aap, dp, gearURL, showGear = false, ownGearError = false;

		switch (args.length) {
			case 0:
				showGear = true;
				ownGearError = true;
				break;

			case 1:
				[ id ] = args;
				showGear = true;
				
				if (id.indexOf('@') < 1) 
					throw new Error("It seems that you didn't mention anyone! Try `!gear @darkceuss`. For more information use `!help gear`");
				break;

			case 2:
				[ gearscore, gearURL ] = args;
				[ ap, aap, dp ] = gearscore.split(/\/+/);
				break;

			case 4:
				[ ap, aap, dp, gearURL ] = args;
				break;

			default:
				throw new Error('It seems you used the command wrongly! For more information use `!help gear`');
		}
    
		if (gearURL) {
			if (!gearURL.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g)) 
				throw new Error("The URL of your img is wrong! It needs to end in one of the following formats: png, jpg or gif. For more information use `!help gear`");
		}
		if (gearscore) {
			if (!gearscore.match(/^[0-9]{1,3}\/[0-9]{1,3}\/[0-9]{1,3}\b/g))
				throw new Error("The format of your gears core is wrong! It needs to be as follows: AP/AAP/DP. For more information use `!help gear`");
		}

		(async function () {	
            let client;

            try {
                client = await MongoClient.connect(urlDB);
                console.log("Connected correctly to server");

				const db = client.db(process.env.DB_DATABASE);
				let r;

				if (showGear) {
					const query = { "id" : extractID(id) };
					
					try {
						r = await db.collection('gear').findOne(query);
						
						const embed = gearEmbed(r);

						message.channel.send({ embed });

					} catch (err) {
						const msg = (ownGearError) ?
							'Please set up your gear! For more information use `!help gear`':
							`Sorry! It seems that he/she hasn't set up his/her gear`;
						
						throw new Error(msg);
					}
					

				} else {
					const query = { "id": id };
                    const updatedDoc = {
                        $set: {
							"name": message.author.lastMessage.member.nickname,
							"id": id,
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
						throw new Error(`Oops! Something went wrong, try again!`);
					}
                     
				}
            } catch (err) {
				throw new Error(err.message);

            } finally {
				client.close();
			}
        })();

	},
};

