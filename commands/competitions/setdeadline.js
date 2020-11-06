const fs = require('fs')
const { Command } = require('discord.js-commando');

module.exports = class Info extends Command {
	constructor(client) {
		super(client, {
			name: 'setdeadline',
			aliases: [],
			group: 'competitions',
			memberName: 'setdeadline',
            description: 'Sets deadline for new competition',
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
                'SEND_MESSAGES',
                'MANAGE_ROLES'
            ],
		});
    }

    run (message, {competitionName, deadline}) {
        const competitions = JSON.parse(fs.readFileSync('./data/competitions/competitions_data.json', 'utf-8'));
        competitions.find(comp => comp.name === competitionName).deadline = deadline;
        let jsonData = JSON.stringify(competitions);
        fs.writeFileSync('./data/competitions/competitions_data.json', jsonData, 'utf-8')
        message.say(`<@${message.author.id}> Deadline set.`)
    }
};