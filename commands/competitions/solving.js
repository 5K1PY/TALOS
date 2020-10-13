const fs = require('fs')
const { Command } = require('discord.js-commando');

module.exports = class Solving extends Command {
	constructor(client) {
		super(client, {
			name: 'solving',
			aliases: [],
			group: 'competitions',
			memberName: 'solving',
            description: 'Adds you a tag for competitions solving. If you are already solving removes it.',
            args: [
                {
                    key: 'competition',
                    prompt: 'What competiton would you like to start solving',
                    type: 'string',
                }
            ],
            userPermissions: [
                'SEND_MESSAGES'
            ],
            clientPermissions: [
                'MANAGE_ROLES'
            ]
		});
    }

    run (message, {competition}) {
        const competitions = JSON.parse(fs.readFileSync('./commands/competitions/competitions_data.json', 'utf-8'));
        var register = competitions.find(comp => comp.name === competition);
        if (message.member._roles.includes(register.role)) {
            message.member.roles.remove(register.role)
        } else {
            message.member.roles.add(register.role)
        }
    }
};