const fs = require('fs')
const { Command } = require('discord.js-commando');

module.exports = class Info extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: [],
			group: 'competitions',
			memberName: 'info',
            description: 'Sends info for competition',
            args: [
                {
                    key: 'competitionName',
                    prompt: 'For what competiton would you like info?',
                    type: 'string',
                }
            ],
            userPermissions: [
                'SEND_MESSAGES'
            ],
		});
    }

    run (message, {competitionName}) {
        const competitions = JSON.parse(fs.readFileSync('./commands/competitions/competitions_data.json', 'utf-8'));
        let competition = competitions.find(comp => comp.name === competitionName);
        let messageText = `<@${message.author.id}> `;
        if (competition === undefined) {
            messageText += 'Unknown competition.';
        } else {
            messageText += `Here's web for ${competition.category.toLowerCase()} ${competition.name}: ${competition.web}`;
        }
        message.say(messageText);
    }
};