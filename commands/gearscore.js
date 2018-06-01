const Discord = require('discord.js'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    { prefix } = require('../config.json');

require('dotenv').config();

const urlDB = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

module.exports = {
    name: 'gearscore',
    description: 'Adds/updates the gearscore of a player',
    execute(message, args) {
        let gearscore, ap, aap, dp, offhand, gearURL;

        if (!args.length) {
            return message.channel.send('Usage info');

        } else if (args.length === 2) {
            [gearscore, gearURL] = args;
            [ap, aap, dp] = parseGearscore(gearscore);

        } else if (args.length === 4) {
            [ap, aap, dp, gearURL] = args;

        } else {
            return message.channel.send(`Usage info`);

        }

        (async function () {
            let client;

            try {
                client = await MongoClient.connect(urlDB);
                console.log("Connected correctly to server");

                const db = client.db(process.env.DB_DATABASE);

                let r = await db.collection('gear').find({ "tag": message.author.tag }).count();

                if (r < 1) {
                    return message.channel.send(`Set up ${prefix}family name and ${prefix}char name first!`);

                } else {
                    const query = { "tag": message.author.tag };

                    const updatedDoc = {
                        $set: {
                            "gear": {
                                "ap": ap,
                                "aap": aap,
                                "dp": dp,
                                "gearURL": gearURL,
                                "score": Math.floor((Number(ap) + Number(aap))/2 + Number(dp))
                            }
                        }
                    };

                    r = await db.collection('gear').updateOne(query, updatedDoc, { upsert: true });

                }

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