const Discord = require('discord.js'),
      fs = require('fs'),
      { prefix } = require('./config.json'),
      client = new Discord.Client();

require('dotenv').config();
const token = (process.env.NODE_ENV == 'prod') ? process.env.AUTH_TOKEN_PROD : process.env.AUTH_TOKEN_DEV ;

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log("Jiro's ready");
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);

	} catch (error) {
		const msg = (error.message) ? error.message : 'there was an error trying to execute that command!';
		
		message.reply(msg);
	}
});

client.login(token);
