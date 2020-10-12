const { Command } = require('discord.js-commando');

module.exports = class Version extends Command {
	constructor(client) {
		super(client, {
			name: 'version',
			aliases: ['v'],
			group: 'utility',
			memberName: 'version',
			description: 'Sends current version.',
		});
    }
    
    run (message) {
        return message.say(`${this.client.user.username} running at version 0.1`)
    }
};