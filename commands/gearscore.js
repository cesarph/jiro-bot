const Discord = require('discord.js'),
	  MongoClient = require('mongodb').MongoClient,
      assert = require('assert');
      
require('dotenv').config();

const urlDB = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

module.exports = {
	name: 'gearscore',
	description: 'Adds/updates the gearscore of a player',
	execute(message, args) {
        let gearscore, ap, aap, dp, offhand, gearURL;

        if (!args.length) {
            return message.channel.send(message.author.tag);
            
        } else if (args.length === 3) {
            [ gearscore, offhand, gearURL ] = args;
            [ ap, aap,  dp ] = parseGearscore(gearscore);

        } else if (args.length === 5) {
           [ ap, aap, dp, offhand, gearURL ] = args;

        } else {
            return message.channel.send(`Usage info`);

        }

		(async function() {
            let client;
          
            try {
                client = await MongoClient.connect(urlDB);
                console.log("Connected correctly to server");

                const db = client.db(process.env.DB_DATABASE);

                const query = {"tag": message.author.tag, "gear.type": offhand};

                const updatedDoc = { $set:  { "gear": {
                                                "type": offhand, 
                                                "ap": ap,
                                                "aap": aap,
                                                "dp": dp,
                                                "gearURL": gearURL  
                                                }
                                            }
                                    };

                let r = await db.collection('gear').updateOne(query,  updatedDoc, { upsert: true });
                                                                
                console.log(r.modifiedCount);
                console.log(r.matchedCount);
                console.log(r.upsertedCount);

                } catch (err) {
                    console.log(err.stack);
                }
            
                // Close connection
                client.close();
          })();

	},
};

function parseGearscore(gs) {
    return gs.split(/\/+/)
}