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
                    key: 'competitionNames',
                    prompt: 'For what competitons would you like info?',
                    type: 'string',
                    parse: arg => arg.split(" ")
                }
            ],
            userPermissions: [
                'SEND_MESSAGES'
            ],
		});
    }

    run (message, {competitionNames}) {
        const competitions = JSON.parse(fs.readFileSync(`./data/${message.guild.id}/competitions/competitions_data.json`, 'utf-8'));
        let messageText = `<@${message.author.id}> `;
        let register;
        if (competitionNames.length === 1 && (competitionNames[0].toLowerCase() === "--all" || competitionNames[0].toLowerCase() === "-a")) {
            register = competitions;
        } else {
            register = competitionNames.map(finding => competitions.find(comp => comp.name.toLowerCase() === finding.toLowerCase()));
        }
        if (register.includes(undefined)) {
            messageText += "Unknown competitions:"
            for (var i=0; i<competitionNames.length; i++) {
                if (register[i] === undefined) {
                    messageText += ` ${competitionNames[i]}` + (i===competitionNames.length-1 ? '':',')
                }
            }
        } else {
            messageText += register.length === 1 ? ' ' : '\n';
            register.forEach(comp => {
                messageText += `Here's web for ${comp.category.toLowerCase()} competiton ${comp.name} ${comp.web}. ${comp.deadline != undefined ? ` Next deadline is ${comp.deadline}`: ''}\n`;
            });
        }
        message.say(messageText);
    }
};