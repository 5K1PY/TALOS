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
                    key: 'userCompetitions',
                    prompt: 'What competiton would you like to start solving',
                    type: 'string',
                    parse: arg => arg.split(" ")
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

    run (message, {userCompetitions}) {
        const competitions = JSON.parse(fs.readFileSync('./commands/competitions/competitions_data.json', 'utf-8'));
        var messageText = `<@${message.author.id}>`;
        let register = userCompetitions.map(finding => competitions.find(comp => comp.name === finding));
        if (register.includes(undefined)) {
            messageText += ` Unknown competitions: ${userCompetitions.filter(
                comp => register[comp.indexOf(userCompetitions)] === undefined
            ).join(", ")
            }.`;
        } else {
            messageText += '\n';
            for (let i=0; i < userCompetitions.length; i++) {
                if (message.member._roles.includes(register[i].role)) {
                    messageText += `You are no longer ${userCompetitions[i]} solver.\n`;
                    message.member.roles.remove(register[i].role);
                } else {
                    messageText += `You are now ${userCompetitions[i]} solver.\n`;
                    message.member.roles.add(register[i].role);
                }
            }
        }
        message.say(messageText);
    }
};