require('dotenv').config()
const Discord = require('discord.js');
const {startTasks} = require('./annual/annual.js');
const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
	commandPrefix: '!',
	owner: '616292913877614638',
	disableEveryone: true,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['utility', 'Useful commands'],
		['community', 'Commands for managing community'],
		['competitions', 'Commands for managing competions'],
		['fun', 'Commands for fun'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity(`${client.commandPrefix}help for help`);
	startTasks(client);
});
	
client.on('error', console.error);

client.login(process.env.TOKEN);