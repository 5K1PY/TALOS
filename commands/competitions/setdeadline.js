const fs = require('fs')
const { Command } = require('discord.js-commando');

module.exports = class Info extends Command {
	constructor(client) {
		super(client, {
			name: 'setdeadline',
			aliases: [],
			group: 'competitions',
			memberName: 'setdeadline',
            description: 'Sends info for competition',
            args: [
                {
                    key: 'competitionName',
                    prompt: 'For what competiton would you like to set deadline?',
                    type: 'string',
                },
                {
                    key: 'deadline',
                    prompt: 'When is the next deadline?',
                    type: 'string',
                    validate: date => date.match(/^\d?\d\. \d?\d\. \d{4}$/) != null,
                },
            ],
            userPermissions: [
                'SEND_MESSAGES'
            ],
		});
    }

    hasPermission (message) {
        return message.member._roles.includes('765941113340821554') // Moderator
    }

    run (message, {competitionName, deadline}) {
        const competitions = JSON.parse(fs.readFileSync('./commands/competitions/competitions_data.json', 'utf-8'));
        competitions.find(comp => comp.name === competitionName).deadline = deadline;
        let jsonData = JSON.stringify(competitions);
        fs.writeFileSync('./commands/competitions/competitions_data.json', jsonData, 'utf-8')
        message.say(`<@${message.author.id}> Deadline set.`)
    }
};